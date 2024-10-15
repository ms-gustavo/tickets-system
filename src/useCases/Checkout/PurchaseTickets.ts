import {
  CreatePaymentIntent,
  FinalizePurchase,
  PurchaseData,
  PurchaseRecord,
  TicketProps,
} from "../../interfaces/interface";
import { EventRepository } from "../../repositories/EventRepository";
import { PromotionRepository } from "../../repositories/PromotionRepository";
import { PurchaseRepository } from "../../repositories/PurchaseRepository";
import { TicketRepository } from "../../repositories/TicketRepository";
import UserRepository from "../../repositories/UserRepository";
import { EmailService } from "../../services/Email/EmailService";
import { GeneratePDFService } from "../../services/GeneratePDF/GeneratePDFService";
import { TicketValidationService } from "../../services/TicketValidation/TicketValidationService";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";
import dotenv from "dotenv";
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_PASS_KEY!);

export class PurchaseUseCase {
  private purchaseRepository: PurchaseRepository;
  private ticketRepository: TicketRepository;
  private promotionRepository: PromotionRepository;
  private ticketValidationService: TicketValidationService;
  private userRepository: UserRepository;
  private eventRepository: EventRepository;

  constructor(purchaseRepository: PurchaseRepository) {
    this.purchaseRepository = purchaseRepository;
    this.ticketRepository = new TicketRepository();
    this.promotionRepository = new PromotionRepository();
    this.ticketValidationService = new TicketValidationService(
      this.ticketRepository
    );
    this.userRepository = new UserRepository();
    this.eventRepository = new EventRepository();
  }

  private async checkIfPromotionIsActive(promotionCode: string) {
    const promotion = await this.promotionRepository.getPromotionByCode(
      promotionCode
    );

    if (
      !promotion ||
      !promotion.isActive ||
      new Date(promotion.expirationDate) < new Date()
    ) {
      const error = promotion
        ? serverStringErrorsAndCodes.promotionExpired
        : serverStringErrorsAndCodes.promotionNotFoundOrExpired;
      throw new AppError(error.message, error.code);
    }
    return promotion;
  }

  private async applyPromotion(promotionCode: string, ticketPrice: number) {
    const promotion = await this.checkIfPromotionIsActive(promotionCode);

    const discountedPrice =
      ticketPrice - (ticketPrice * promotion.discount) / 100;
    return { promotionId: promotion.id, discountedPrice };
  }

  private async getUserAndEventData(userId: string, eventId: string) {
    const [user, event] = await Promise.all([
      this.userRepository.findById(userId),
      this.eventRepository.getEventById(eventId),
    ]);

    return { user, event };
  }

  private async finalizePurchaseSendingTicketPDFToEmail(
    purchaseData: PurchaseData[]
  ) {
    if (purchaseData.length === 0) {
      throw new AppError("Nenhum dado de compra fornecido.", 400);
    }
    console.log("DADOS DA COMPRA", purchaseData);
    const { userId, eventId, ticketId, totalPrice } = purchaseData[0];
    const { user, event } = await this.getUserAndEventData(userId, eventId);
    const ticketType =
      event!.tickets.find((ticket) => ticket.id === ticketId)?.type ||
      "Não informado";
    const allPdfBuffers = await Promise.all(
      Array.from({ length: purchaseData.length }, async (_, i) => {
        const pdfBuffer = await GeneratePDFService.generateTicketPDF({
          ticketId,
          userName: user!.name,
          userEmail: user!.email,
          eventTitle: event!.title,
          ticketType,
          ticketPrice: totalPrice,
          eventDate: event!.date,
          eventLocation: event!.location,
        });
        return {
          filename: `${event!.title}-${i + 1}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        };
      })
    );
    await EmailService.sendEmail({
      email: user!.email,
      subject: `Ingressos para ${event!.title}`,
      text: `Segue em anexo seus ingressos para o evento ${event!.title}`,
      attachments: allPdfBuffers,
    });
  }

  private async checkIfAreTicketsAvailable(ticketId: string, quantity: number) {
    const ticket = await this.ticketValidationService.checkIfTicketExists(
      ticketId
    );

    if (ticket.amount < quantity) {
      throw new AppError(
        serverStringErrorsAndCodes.ticketSoldOut.message,
        serverStringErrorsAndCodes.ticketSoldOut.code
      );
    }

    return ticket;
  }

  private async calculateTicketValue(
    quantity: number,
    ticket: TicketProps,
    promotionCode?: string
  ) {
    const basePrice = ticket.price * quantity;
    if (!promotionCode) return { totalPrice: basePrice };

    const { promotionId, discountedPrice } = await this.applyPromotion(
      promotionCode,
      ticket.price
    );
    const totalPrice = discountedPrice * quantity;
    return { totalPrice, appliedPromotionId: promotionId };
  }

  private async createPurchaseRecord({
    userId,
    eventId,
    ticketId,
    quantity,
    appliedPromotionId,
    totalPrice,
  }: PurchaseRecord) {
    return Promise.all(
      Array.from({ length: quantity }, () =>
        this.purchaseRepository.createPurchase({
          userId,
          eventId,
          ticketId,
          quantity: 1,
          totalPrice: totalPrice / quantity,
          promotionCode: appliedPromotionId,
        })
      )
    );
  }

  async createPaymentIntent({
    userId,
    eventId,
    ticketId,
    quantity,
    promotionCode,
  }: CreatePaymentIntent) {
    const ticket = await this.checkIfAreTicketsAvailable(ticketId, quantity);
    const { totalPrice } = await this.calculateTicketValue(
      quantity,
      ticket,
      promotionCode
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
      currency: "brl",
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
      metadata: { userId, eventId, ticketId, quantity: quantity.toString() },
    });
    return { clientSecret: paymentIntent.client_secret };
  }

  async finalizePurchase({
    paymentIntentId,
    userId,
    eventId,
    ticketId,
    quantity,
    promotionCode,
  }: FinalizePurchase) {
    console.log("QUANTIDADE FINALIZE PURCH", quantity);
    //JUST FOR TESTING BECAUSE I CANNOT CHANGE THE PAYMENT INTENTION STATUS PROPERLY WITHOUT THE FRONT END
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: "pm_card_visa",
    });
    if (paymentIntent.status !== "succeeded")
      throw new AppError(`Pagamento não foi confirmado`, 400);

    const ticket = await this.checkIfAreTicketsAvailable(ticketId, quantity);
    const { totalPrice, appliedPromotionId } = await this.calculateTicketValue(
      quantity,
      ticket,
      promotionCode
    );
    const purchases = await this.createPurchaseRecord({
      userId,
      eventId,
      ticketId,
      quantity,
      appliedPromotionId,
      totalPrice,
    });
    console.log(purchases);
    await this.ticketRepository.updateTicket({
      id: ticketId,
      eventId,
      price: ticket.price,
      type: ticket.type,
      amount: ticket.amount - quantity,
    });
    await this.finalizePurchaseSendingTicketPDFToEmail(purchases);
    return purchases;
  }
}

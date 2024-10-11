import { stripVTControlCharacters } from "util";
import { CreatePaymentIntent, FinalizePurchase, PurchaseData, PurchaseRecord } from "../../interfaces/interface";
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
    if (!promotion || !promotion.isActive) {
      throw new AppError(
        serverStringErrorsAndCodes.promotionNotFoundOrExpired.message,
        serverStringErrorsAndCodes.promotionNotFoundOrExpired.code
      );
    }
    const promotionExpired = new Date(promotion.expirationDate) < new Date();
    if (promotionExpired) {
      throw new AppError(
        serverStringErrorsAndCodes.promotionExpired.message,
        serverStringErrorsAndCodes.promotionExpired.code
      );
    }
    return promotion;
  }

  private async applyPromotion(promotionCode: string, ticketPrice: number) {
    const promotion = await this.checkIfPromotionIsActive(promotionCode);

    const discountedPrice =
      ticketPrice - (ticketPrice * promotion.discount) / 100;
    return { promotionId: promotion.id, discountedPrice };
  }

  private async getUserAndEventData(purchaseData: PurchaseData[]) {
    const [user, event] = await Promise.all([
      this.userRepository.findById(purchaseData[0].userId),
      this.eventRepository.getEventById(purchaseData[0].eventId),
    ]);

    return { user, event };
  }

  private async finalizePurchaseSendingTicketPDFToEmail(
    purchaseData: PurchaseData[]
  ) {
    const { user, event } = await this.getUserAndEventData(purchaseData);

    const ticketData = {
      ticketId: purchaseData[0].ticketId,
      userName: user!.name,
      userEmail: user!.email,
      eventTitle: event!.title,
      ticketType: event!.title,
      ticketPrice: purchaseData[0].totalPrice,
      eventDate: event!.date,
      eventLocation: event!.location,
    };

    const pdfBuffer = await GeneratePDFService.generateTicketPDF(ticketData);

    await EmailService.sendEmail({
      email: user!.email,
      subject: `Ingresso para ${event!.title}`,
      text: `Segue em anexo seu(s) ingresso(s) para o evento ${event!.title}`,
      attachment: {
        filename: `${event!.title}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    });
  }

  private async checkIfAreTicketsAvailable(ticketId: string, quantity: number){
    const ticket = await this.ticketValidationService.checkIfTicketExists(ticketId)

    if(ticket.amount < quantity){
      throw new AppError(
        serverStringErrorsAndCodes.ticketSoldOut.message,
        serverStringErrorsAndCodes.ticketSoldOut.code
      )
    }
  
    return ticket
    }


    private async calculateTicketValue(quantity: number, ticket:any, promotionCode?: string){

    let appliedPromotionId: string | undefined;
    let totalPrice = ticket.price * quantity;
    if (promotionCode) {
      const { promotionId, discountedPrice } = await this.applyPromotion(
        promotionCode,
        ticket.price
      );
      totalPrice = discountedPrice * quantity;
      appliedPromotionId = promotionId;
    }

    return {totalPrice, appliedPromotionId}

    }

    private async createPurchaseRecord({userId, eventId, ticketId, quantity, appliedPromotionId, totalPrice}: PurchaseRecord){
      const purchases = [];
      for (let i = 0; i < quantity; i++) {
        const purchaseRecord = await this.purchaseRepository.createPurchase({
          userId,
          eventId,
          ticketId,
          quantity: 1,
          totalPrice: totalPrice / quantity,
          promotionCode: appliedPromotionId,
        });
        purchases.push(purchaseRecord);
      } 

      return purchases
    }


  async createPaymentIntent({
    userId,
    eventId,
    ticketId,
    quantity,
    promotionCode
  }: CreatePaymentIntent) {
    const ticket = await this.checkIfAreTicketsAvailable(ticketId, quantity);

    const { totalPrice, appliedPromotionId } = await this.calculateTicketValue(quantity, ticket, promotionCode)

    //TODO: INSTALAR STRIPE
    const amountInCents = totalPrice * 100

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'brl',
      metadata: {
        userId: userId,
        eventId: eventId,
        ticketId: ticketId,
        quantity: quantity.toString()
      }
    })


    return {clientSecret: paymentIntent.client_secret}
  }

  async finalizePurchase({
    paymentIntentId,
    userId,
    eventId,
    ticketId,
    quantity,
    promotionCode
  }: FinalizePurchase ){
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentid)

    if(paymentIntent.status !== 'succeeded'){
      throw new AppError(`Pagamento não foi confirmado`, 400)
    }

    const ticket = await this.checkIfAreTicketsAvailable(ticketId, quantity);

    const { totalPrice, appliedPromotionId } = await this.calculateTicketValue(quantity, ticket, promotionCode)

    const purchases = await this.createPurchaseRecord({userId, eventId, ticketId, quantity, appliedPromotionId, totalPrice})
    
    return purchases

  }

  async execute({
    userId,
    eventId,
    ticketId,
    quantity,
    promotionCode,
  }: {
    userId: string;
    eventId: string;
    ticketId: string;
    quantity: number;
    promotionCode?: string;
  }) {
    const ticket = await this.ticketValidationService.checkIfTicketExists(
      ticketId
    );

    if (ticket.amount < quantity) {
      throw new AppError(
        serverStringErrorsAndCodes.ticketSoldOut.message,
        serverStringErrorsAndCodes.ticketSoldOut.code
      );
    }

    let appliedPromotionId: string | undefined;
    let totalPrice = ticket.price * quantity;
    if (promotionCode) {
      const { promotionId, discountedPrice } = await this.applyPromotion(
        promotionCode,
        ticket.price
      );
      totalPrice = discountedPrice * quantity;
      appliedPromotionId = promotionId;
    }

    const purchases = [];
    for (let i = 0; i < quantity; i++) {
      const purchaseRecord = await this.purchaseRepository.createPurchase({
        userId,
        eventId,
        ticketId,
        quantity: 1,
        totalPrice: totalPrice / quantity,
        promotionCode: appliedPromotionId,
      });
      purchases.push(purchaseRecord);
    }

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

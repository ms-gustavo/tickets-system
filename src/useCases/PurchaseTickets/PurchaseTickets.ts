import { PromotionRepository } from "../../repositories/PromotionRepository";
import { PurchaseRepository } from "../../repositories/PurchaseRepository";
import { TicketRepository } from "../../repositories/TicketRepository";
import { TicketValidationService } from "../../services/TicketValidation/TicketValidationService";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";

export class PurchaseUseCase {
  private purchaseRepository: PurchaseRepository;
  private ticketRepository: TicketRepository;
  private promotionRepository: PromotionRepository;
  private ticketValidationService: TicketValidationService;

  constructor(
    purchaseRepository: PurchaseRepository,
    ticketRepository: TicketRepository,
    promotionRepository: PromotionRepository
  ) {
    this.purchaseRepository = purchaseRepository;
    this.ticketRepository = ticketRepository;
    this.promotionRepository = promotionRepository;
    this.ticketValidationService = new TicketValidationService(
      this.ticketRepository
    );
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
    return discountedPrice;
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
      ticketId!
    );

    let totalPrice = ticket.price * quantity;
    if (promotionCode) {
      totalPrice = await this.applyPromotion(promotionCode, ticket.price);
    }

    const purchase = await this.purchaseRepository.createPurchase({
      userId,
      eventId,
      ticketId,
      quantity,
      totalPrice,
      promotionCode,
    });

    return purchase;
  }
}

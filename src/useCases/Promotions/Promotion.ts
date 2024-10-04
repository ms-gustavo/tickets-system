import { PromotionProps } from "../../interfaces/interface";
import { EventRepository } from "../../repositories/EventRepository";
import { PromotionRepository } from "../../repositories/PromotionRepository";
import { EventValidationService } from "../../services/EventValidation/EventValidationService";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";

export class PromotionUseCases {
  private promotionRepository: PromotionRepository;
  private eventRepository: EventRepository;
  private eventValidationService: EventValidationService;

  constructor(promotionRepository: PromotionRepository) {
    this.promotionRepository = promotionRepository;
    this.eventRepository = new EventRepository();
    this.eventValidationService = new EventValidationService(
      this.eventRepository
    );
  }

  private async checkIfPromotionAlreadyExists(code: string) {
    const promotionExists = await this.promotionRepository.getPromotionByCode(
      code
    );

    if (promotionExists) {
      throw new AppError(
        serverStringErrorsAndCodes.promotionAlreadyExists.message,
        serverStringErrorsAndCodes.promotionAlreadyExists.code
      );
    }

    return promotionExists;
  }

  private async checkIfPromotionExistsById(id: string) {
    const promotionExists = await this.promotionRepository.getPromotionById(id);

    if (!promotionExists) {
      throw new AppError(
        serverStringErrorsAndCodes.promotionNotFound.message,
        serverStringErrorsAndCodes.promotionNotFound.code
      );
    }

    return promotionExists;
  }

  private async checkIfDiscountIsValid(discount: number) {
    if (discount <= 0 || discount > 100) {
      throw new AppError(
        serverStringErrorsAndCodes.invalidDiscount.message,
        serverStringErrorsAndCodes.invalidDiscount.code
      );
    }
  }

  async createPromotion({
    eventId,
    code,
    discount,
    expirationDate,
  }: PromotionProps) {
    await this.checkIfPromotionAlreadyExists(code);
    await this.checkIfDiscountIsValid(discount);
    return await this.promotionRepository.createPromotion({
      eventId,
      code,
      discount,
      expirationDate,
    });
  }

  async getPromotionById(id: string) {
    return await this.checkIfPromotionExistsById(id);
  }

  async getPromotionByCode(code: string) {
    return await this.checkIfPromotionAlreadyExists(code);
  }

  async getPromotionsByEventId(eventId: string) {
    return await this.promotionRepository.getPromotionsByEventId(eventId);
  }

  async deletePromotion(id: string) {
    await this.checkIfPromotionExistsById(id);
    return await this.promotionRepository.deletePromotion(id);
  }

  async updatePromotion({
    id,
    eventId,
    code,
    discount,
    expirationDate,
  }: PromotionProps) {
    await this.eventValidationService.checkIfEventExistsById(eventId);
    await this.checkIfPromotionExistsById(id!);
    await this.checkIfDiscountIsValid(discount);
    return await this.promotionRepository.updatePromotion({
      id,
      eventId,
      code,
      discount,
      expirationDate,
    });
  }
}

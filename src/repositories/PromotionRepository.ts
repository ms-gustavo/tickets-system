import prisma from "../../prisma/prisma";
import { PromotionProps } from "../interfaces/interface";

export class PromotionRepository {
  async getPromotionById(id: string) {
    return await prisma.promotion.findUnique({
      where: { id },
      include: { event: true },
    });
  }

  async getAllPromotions() {
    return await prisma.promotion.findMany({
      include: { event: true },
    });
  }

  async getPromotionByCode(code: string) {
    return await prisma.promotion.findFirst({
      where: { code },
      include: { event: true },
    });
  }

  async getPromotionsByEventId(eventId: string) {
    return await prisma.promotion.findMany({
      where: { eventId },
    });
  }

  async createPromotion({
    eventId,
    code,
    discount,
    expirationDate,
  }: PromotionProps) {
    return await prisma.promotion.create({
      data: {
        eventId,
        code,
        discount,
        expirationDate,
      },
    });
  }

  async deletePromotion(id: string) {
    return await prisma.promotion.delete({
      where: { id },
    });
  }

  async updatePromotion({
    id,
    eventId,
    code,
    discount,
    expirationDate,
    isActive,
  }: PromotionProps) {
    return await prisma.promotion.update({
      where: { id },
      data: {
        eventId,
        code,
        discount,
        expirationDate,
        isActive,
      },
    });
  }
}

import prisma from "../../prisma/prisma";
import { PurchaseProps } from "../interfaces/interface";

export class PurchaseRepository {
  async createPurchase({
    userId,
    eventId,
    ticketId,
    quantity,
    totalPrice,
    promotionCode,
  }: PurchaseProps) {
    return await prisma.purchase.create({
      data: { userId, eventId, ticketId, quantity, totalPrice, promotionCode },
    });
  }

  async getPurchasesByUserId(userId: string) {
    return await prisma.purchase.findMany({
      where: { userId },
    });
  }

  async getPurchaseById(id: string) {
    return await prisma.purchase.findUnique({
      where: { id },
    });
  }

  async getPurchasesByEventId(eventId: string) {
    return await prisma.purchase.findMany({
      where: { eventId },
    });
  }
}

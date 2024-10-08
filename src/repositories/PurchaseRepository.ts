import prisma from "../../prisma/prisma";
import { PurchaseProps } from "../interfaces/interface";

export class PurchaseRepository {
  async createPurchase({
    userId,
    eventId,
    ticketId,
    quantity,
    totalPrice,
    discount,
  }: PurchaseProps) {
    return await prisma.purchase.create({
      data: { userId, eventId, ticketId, quantity, totalPrice, discount },
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
}

import { Request, Response } from "express";
import { PurchaseRepository } from "../repositories/PurchaseRepository";
import { PurchaseUseCase } from "../useCases/PurchaseTickets/PurchaseTickets";
import { CreatePurchaseDTO } from "../dtos/PurchaseTicketsDTO/create";
import { AppError } from "../shared/appErrors";

const purchaseRepository = new PurchaseRepository();
const purchaseUseCase = new PurchaseUseCase(purchaseRepository);

export class PurchaseTicketsController {
  async createPurchase(req: Request, res: Response) {
    const {
      userId,
      eventId,
      ticketId,
      quantity,
      promotionCode,
    }: CreatePurchaseDTO = req.body;

    try {
      const purchase = await purchaseUseCase.execute({
        userId,
        eventId,
        ticketId,
        quantity,
        promotionCode,
      });
      res.status(201).json(purchase);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
      return;
    }
  }
}

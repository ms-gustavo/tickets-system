import { Request, Response } from "express";
import { PromotionRepository } from "../repositories/PromotionRepository";
import { PromotionUseCases } from "../useCases/Promotions/Promotion";
import { CreatePromotionDTO } from "../dtos/PromotionDTO/create";
import { AppError } from "../shared/appErrors";

const promotionRepository = new PromotionRepository();
const promotionUseCase = new PromotionUseCases(promotionRepository);

export class PromotionController {
  async createPromotion(req: Request, res: Response) {
    const { eventId, code, discount, expirationDate }: CreatePromotionDTO =
      req.body;

    try {
      const promotion = await promotionUseCase.createPromotion({
        eventId,
        code,
        discount,
        expirationDate,
      });
      res.status(201).json(promotion);
      return;
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

  async getAllPromotions(req: Request, res: Response) {
    try {
      const promotions = await promotionUseCase.getAllPromotions();
      res.status(200).json(promotions);
      return;
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

  async getAllPromotionsByEventId(req: Request, res: Response) {
    const { eventId } = req.params;

    try {
      const promotions = await promotionUseCase.getPromotionsByEventId(eventId);
      res.status(200).json(promotions);
      return;
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

  async getPromotionById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const promotion = await promotionUseCase.getPromotionById(id);
      res.status(200).json(promotion);
      return;
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

  async getPromotionByCode(req: Request, res: Response) {
    const { code } = req.params;

    try {
      const promotion = await promotionUseCase.getPromotionByCode(code);
      res.status(200).json(promotion);
      return;
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

  async deletePromotion(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await promotionUseCase.deletePromotion(id);
      res.status(204).send();
      return;
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

  async updatePromotion(req: Request, res: Response) {
    const { id } = req.params;
    const {
      eventId,
      code,
      discount,
      expirationDate,
      isActive,
    }: CreatePromotionDTO = req.body;
    try {
      const promotion = await promotionUseCase.updatePromotion({
        id,
        eventId,
        code,
        discount,
        expirationDate,
        isActive,
      });
      res.status(200).json(promotion);
      return;
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

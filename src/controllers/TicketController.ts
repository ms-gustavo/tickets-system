import { Request, Response } from "express";
import { TicketRepository } from "../repositories/TicketRepository";
import { TicketUseCases } from "../useCases/Tickets/Ticket";
import { AppError } from "../shared/appErrors";
import { CreateTicketDTO } from "../dtos/TicketDTO/create";

const ticketRepository = new TicketRepository();
const ticketUseCase = new TicketUseCases(ticketRepository);

export class TicketController {
  async createTicket(req: Request, res: Response) {
    const { eventId, price, type, amount }: CreateTicketDTO = req.body;

    try {
      const ticket = await ticketUseCase.createTicket({
        eventId,
        price,
        type,
        amount,
      });
      res.status(201).json(ticket);
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

  async getAllTicketsByEventId(req: Request, res: Response) {
    const { eventId } = req.params;

    try {
      const tickets = await ticketUseCase.getTicketsByEventId(eventId);
      res.status(200).json(tickets);
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

  async getTicketById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const ticket = await ticketUseCase.getTicketById(id);
      res.status(200).json(ticket);
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

  async updateTicket(req: Request, res: Response) {
    const { id } = req.params;
    const { eventId, price, type, amount }: CreateTicketDTO = req.body;

    try {
      const ticket = await ticketUseCase.updateTicket({
        id,
        eventId,
        price,
        type,
        amount,
      });
      res.status(200).json(ticket);
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

  async deleteTicket(req: Request, res: Response) {
    const { id } = req.params;
    const { eventId } = req.body;

    try {
      await ticketUseCase.deleteTicket(eventId, id);
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
}

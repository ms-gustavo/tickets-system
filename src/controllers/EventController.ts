import { Request, Response } from "express";
import { EventRepository } from "../repositories/EventRepository";
import { EventUseCases } from "../useCases/Events/Event";
import { CreateEventDTO } from "../dtos/EventDTO/create";
import { AppError } from "../shared/appErrors";

const eventRepository = new EventRepository();
const eventUseCase = new EventUseCases(eventRepository);

export class EventController {
  async createEvent(req: Request, res: Response) {
    const { title, description, date, location, createdBy }: CreateEventDTO =
      req.body;

    try {
      const event = await eventUseCase.create({
        title,
        description,
        date,
        location,
        createdBy,
      });
      res.status(201).json(event);
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

  async getAllEvents(req: Request, res: Response) {
    try {
      const events = await eventUseCase.getAllEvents();
      res.status(200).json(events);
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

  async getEventById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const event = await eventUseCase.getEventById(id);
      res.status(200).json(event);
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

  async updateEvent(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, date, location, createdBy }: CreateEventDTO =
      req.body;

    try {
      const event = await eventUseCase.updateEvent({
        id,
        title,
        description,
        date,
        location,
        createdBy,
      });
      res.status(200).json(event);
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

  async deleteEvent(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await eventUseCase.deleteEvent(id);
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

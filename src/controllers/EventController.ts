import { Request, Response } from "express";
import { EventRepository } from "../repositories/EventRepository";
import { CreateEventUseCase } from "../useCases/Events/CreateEvent";
import { CreateEventDTO } from "../dtos/EventDTO/create";
import { AppError } from "../shared/appErrors";

const eventRepository = new EventRepository();

export class EventController {
  async createEvent(req: Request, res: Response) {
    const { title, description, date, location, createdBy }: CreateEventDTO =
      req.body;
    const createEventUseCase = new CreateEventUseCase(eventRepository);

    try {
      const event = await createEventUseCase.execute({
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
      res
        .status(500)
        .json({
          message: "Internal server error",
          error: (error as Error).message,
        });
      return;
    }
  }
}

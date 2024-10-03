import { EventRepository } from "../../repositories/EventRepository";
import { CreateEventProps } from "../../interfaces/interface";

export class CreateEventUseCase {
  private eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async execute({
    title,
    description,
    date,
    location,
    createdBy,
  }: CreateEventProps) {
    return await this.eventRepository.createEvent({
      title,
      description,
      date,
      location,
      createdBy,
    });
  }
}

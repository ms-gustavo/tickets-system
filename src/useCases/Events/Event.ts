import { EventRepository } from "../../repositories/EventRepository";
import { CreateEventProps } from "../../interfaces/interface";

export class EventUseCases {
  private eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async create({
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

  async getAllEvents() {
    return await this.eventRepository.getAllEvents();
  }
}

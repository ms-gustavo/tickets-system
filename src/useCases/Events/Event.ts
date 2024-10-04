import { EventRepository } from "../../repositories/EventRepository";
import { CreateEventProps } from "../../interfaces/interface";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";
import { EventValidationService } from "../../services/EventValidation/EventValidationService";

export class EventUseCases {
  private eventRepository: EventRepository;
  private eventValidationService: EventValidationService;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
    this.eventValidationService = new EventValidationService(eventRepository);
  }

  private async checkIfEventExistsByName(title: string) {
    const eventExists = await this.eventRepository.findByName(title);

    if (eventExists) {
      throw new AppError(
        serverStringErrorsAndCodes.eventAlreadyExists.message,
        serverStringErrorsAndCodes.eventAlreadyExists.code
      );
    }

    return eventExists;
  }

  async create({
    title,
    description,
    date,
    location,
    createdBy,
  }: CreateEventProps) {
    const titleToUpperCase: string = title.toUpperCase();

    await this.checkIfEventExistsByName(titleToUpperCase);

    return await this.eventRepository.createEvent({
      title: titleToUpperCase,
      description,
      date,
      location,
      createdBy,
    });
  }

  async getAllEvents() {
    return await this.eventRepository.getAllEvents();
  }

  async getEventById(id: string) {
    await this.eventValidationService.checkIfEventExistsById(id);

    return await this.eventRepository.getEventById(id);
  }

  async updateEvent({
    id,
    title,
    description,
    date,
    location,
    createdBy,
  }: CreateEventProps) {
    await this.eventValidationService.checkIfEventExistsById(id!);

    const titleToUpperCase: string = title?.toUpperCase();

    return await this.eventRepository.updateEvent({
      id,
      title: titleToUpperCase,
      description,
      date,
      location,
      createdBy,
    });
  }

  async deleteEvent(id: string) {
    await this.eventValidationService.checkIfEventExistsById(id!);
    return await this.eventRepository.deleteEvent(id);
  }
}

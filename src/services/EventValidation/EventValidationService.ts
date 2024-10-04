import { EventRepository } from "../../repositories/EventRepository";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";

export class EventValidationService {
  private eventRepository: EventRepository;

  constructor(eventRepository: EventRepository) {
    this.eventRepository = eventRepository;
  }

  async checkIfEventExistsById(id: string) {
    const eventExists = await this.eventRepository.getEventById(id);

    if (!eventExists) {
      throw new AppError(
        serverStringErrorsAndCodes.eventNotFound.message,
        serverStringErrorsAndCodes.eventNotFound.code
      );
    }

    return eventExists;
  }
}

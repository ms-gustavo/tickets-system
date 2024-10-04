import { TicketProps } from "../../interfaces/interface";
import { TicketRepository } from "../../repositories/TicketRepository";
import { EventValidationService } from "../../services/EventValidation/EventValidationService";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";

export class TicketUseCases {
  private ticketRepository: TicketRepository;
  private eventValidationService: EventValidationService;

  constructor(
    ticketRepository: TicketRepository,
    eventValidationService: EventValidationService
  ) {
    this.ticketRepository = ticketRepository;
    this.eventValidationService = eventValidationService;
  }

  private async checkIfTicketAlreadyExists(type: string) {
    const ticketExists = await this.ticketRepository.findByType(type);

    if (ticketExists) {
      throw new AppError(
        serverStringErrorsAndCodes.ticketAlreadyExists.message,
        serverStringErrorsAndCodes.ticketAlreadyExists.code
      );
    }
  }

  private async checkIfTicketExistsById(id: string) {
    const ticketExists = await this.ticketRepository.getTicketById(id);

    if (!ticketExists) {
      throw new AppError(
        serverStringErrorsAndCodes.ticketNotFound.message,
        serverStringErrorsAndCodes.ticketNotFound.code
      );
    }

    return ticketExists;
  }

  async createTicket({ eventId, price, type, amount }: TicketProps) {
    await this.eventValidationService.checkIfEventExistsById(eventId);
    const typeToUpperCase: string = type.toUpperCase();

    await this.checkIfTicketAlreadyExists(typeToUpperCase);

    return await this.ticketRepository.createTicket({
      eventId,
      price,
      type: typeToUpperCase,
      amount,
    });
  }

  async getTicketById(id: string) {
    return await this.ticketRepository.getTicketById(id);
  }

  async getTicketsByEventId(eventId: string) {
    await this.eventValidationService.checkIfEventExistsById(eventId);
    return await this.ticketRepository.getTicketsByEventId(eventId);
  }

  async updateTicket({ id, eventId, price, type, amount }: TicketProps) {
    await this.eventValidationService.checkIfEventExistsById(eventId);
    await this.checkIfTicketExistsById(id!);

    return await this.ticketRepository.updateTicket({
      id,
      eventId,
      price,
      type,
      amount,
    });
  }
}

import { TicketProps } from "../../interfaces/interface";
import { EventRepository } from "../../repositories/EventRepository";
import { TicketRepository } from "../../repositories/TicketRepository";
import { EventValidationService } from "../../services/EventValidation/EventValidationService";
import { TicketValidationService } from "../../services/TicketValidation/TicketValidationService";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";

export class TicketUseCases {
  private ticketRepository: TicketRepository;
  private eventRepository: EventRepository;
  private eventValidationService: EventValidationService;
  private ticketValidationService: TicketValidationService;

  constructor(ticketRepository: TicketRepository) {
    this.ticketRepository = ticketRepository;
    this.eventRepository = new EventRepository();
    this.eventValidationService = new EventValidationService(
      this.eventRepository
    );
    this.ticketValidationService = new TicketValidationService(
      this.ticketRepository
    );
  }

  private async checkIfTicketAlreadyExists(eventId: string, type: string) {
    const ticketExists = await this.ticketRepository.findByType(eventId, type);

    if (ticketExists) {
      throw new AppError(
        serverStringErrorsAndCodes.ticketAlreadyExists.message,
        serverStringErrorsAndCodes.ticketAlreadyExists.code
      );
    }
  }

  private async checkIfPriceAndAmountIsValid(price: number, amount: number) {
    if (price < 0 || amount <= 0) {
      throw new AppError(
        serverStringErrorsAndCodes.invalidPriceOrAmount.message,
        serverStringErrorsAndCodes.invalidPriceOrAmount.code
      );
    }
  }

  async createTicket({ eventId, price, type, amount }: TicketProps) {
    await this.eventValidationService.checkIfEventExistsById(eventId);
    await this.checkIfPriceAndAmountIsValid(price, amount);
    const typeToUpperCase: string = type.toUpperCase();

    await this.checkIfTicketAlreadyExists(eventId, typeToUpperCase);

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
    await this.ticketValidationService.checkIfTicketExists(id!);
    await this.checkIfPriceAndAmountIsValid(price, amount);

    return await this.ticketRepository.updateTicket({
      id,
      eventId,
      price,
      type,
      amount,
    });
  }

  async deleteTicket(id: string) {
    await this.ticketValidationService.checkIfTicketExists(id);
    return await this.ticketRepository.deleteTicket(id);
  }
}

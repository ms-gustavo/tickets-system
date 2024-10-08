import { TicketRepository } from "../../repositories/TicketRepository";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";

export class TicketValidationService {
  private ticketRepository: TicketRepository;

  constructor(ticketRepository: TicketRepository) {
    this.ticketRepository = ticketRepository;
  }

  async checkIfTicketExists(ticketId: string) {
    const ticketExists = await this.ticketRepository.getTicketById(ticketId);

    if (!ticketExists) {
      throw new AppError(
        serverStringErrorsAndCodes.ticketNotFound.message,
        serverStringErrorsAndCodes.ticketNotFound.code
      );
    }

    return ticketExists;
  }
}

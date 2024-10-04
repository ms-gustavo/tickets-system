import prisma from "../../prisma/prisma";
import { TicketProps } from "../interfaces/interface";

export class TicketRepository {
  async findByType(eventId: string, type: string) {
    return await prisma.ticket.findFirst({
      where: { eventId, type },
    });
  }

  async createTicket({ eventId, price, type, amount }: TicketProps) {
    return await prisma.ticket.create({
      data: { eventId, price, type, amount },
    });
  }

  async getTicketById(id: string) {
    return await prisma.ticket.findUnique({
      where: { id },
      include: {
        event: true,
      },
    });
  }

  async getTicketsByEventId(eventId: string) {
    return await prisma.ticket.findMany({
      where: { eventId },
    });
  }

  async updateTicket({ id, eventId, price, type, amount }: TicketProps) {
    return await prisma.ticket.update({
      where: { id },
      data: { eventId, price, type, amount },
    });
  }

  async deleteTicket(id: string) {
    return await prisma.ticket.delete({
      where: { id },
    });
  }
}

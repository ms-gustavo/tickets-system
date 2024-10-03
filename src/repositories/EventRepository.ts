import prisma from "../../prisma/prisma";
import { CreateEventProps } from "../interfaces/interface";

export class EventRepository {
  async findByName(title: string) {
    return await prisma.event.findFirst({
      where: { title },
    });
  }

  async createEvent({
    title,
    description,
    date,
    location,
    createdBy,
  }: CreateEventProps) {
    return await prisma.event.create({
      data: {
        title,
        description,
        date,
        location,
        createdBy,
      },
    });
  }

  async getAllEvents() {
    return await prisma.event.findMany({
      include: {
        tickets: true,
      },
    });
  }

  async getEventById(id: string) {
    return await prisma.event.findUnique({
      where: { id },
      include: {
        tickets: true,
      },
    });
  }

  async updateEvent({
    id,
    title,
    description,
    date,
    location,
    createdBy,
  }: CreateEventProps) {
    return await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date,
        location,
        createdBy,
      },
    });
  }

  async deleteEvent(id: string) {
    return await prisma.event.delete({
      where: { id },
    });
  }
}

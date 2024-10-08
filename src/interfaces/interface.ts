import { ROLE } from "@prisma/client";

export interface LoginUserProps {
  email: string;
  password: string;
}

export interface CreateUserProps extends LoginUserProps {
  name: string;
  role: ROLE;
}

export interface CreateEventProps {
  id?: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: string;
}

export interface TicketProps {
  id?: string;
  eventId: string;
  price: number;
  type: string;
  amount: number;
}

export interface PromotionProps {
  id?: string;
  eventId: string;
  code: string;
  discount: number;
  expirationDate: Date;
  isActive?: boolean;
}

export interface TokenPayload {
  userId: string;
  role: string;
  iat: number;
}

export interface SendEmailLoginProps {
  email: string;
  subject: string;
  text: string;
  attachment?: {
    filename: string;
    content: Buffer;
    contentType: string;
  };
}

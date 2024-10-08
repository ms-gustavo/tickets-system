import { ROLE } from "@prisma/client";

export interface LoginUserProps {
  email: string;
  password: string;
}

export interface CreateUserProps extends LoginUserProps {
  name: string;
  role: ROLE;
}

export interface CreateTempUserProps extends CreateUserProps {
  confirmId: string;
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

export interface PurchaseProps {
  id?: string;
  userId: string;
  eventId: string;
  ticketId: string;
  quantity: number;
  totalPrice: number;
  promotionCode?: string;
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

export interface EmailServiceMessagesProps {
  name?: string;
  newConfirmationLink?: string;
  fromUser?: string;
  amount?: number;
  toUser?: string;
  attachment?: {
    filename?: string;
    content: Buffer;
    contentType?: string;
  };
}

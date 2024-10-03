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

export interface TokenPayload {
  userId: string;
  role: string;
  iat: number;
}

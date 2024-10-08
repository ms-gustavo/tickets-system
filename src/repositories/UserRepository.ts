import prisma from "../../prisma/prisma";
import { CreateUserProps } from "../interfaces/interface";

export default class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser({ name, email, password, role }: CreateUserProps) {
    return await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
  }
}

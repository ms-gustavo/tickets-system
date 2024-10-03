import prisma from "../../prisma/prisma";
import bcrypt from "bcryptjs";
import { CreateUserProps } from "../interfaces/interface";

export default class UserRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser({ name, email, password, role }: CreateUserProps) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      select: {
        name: true,
        email: true,
        role: true,
      },
    });
  }
}

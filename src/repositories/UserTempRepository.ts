import prisma from "../../prisma/prisma";
import { CreateTempUserProps } from "../interfaces/interface";

export default class UserTempRepository {
  async findByEmail(email: string) {
    return await prisma.userTemp.findUnique({
      where: { email },
    });
  }

  async findByConfirmId(confirmId: string) {
    return await prisma.userTemp.findUnique({
      where: { confirmId },
    });
  }

  async createUserTemp({
    name,
    email,
    password,
    role,
    confirmId,
  }: CreateTempUserProps) {
    return await prisma.userTemp.create({
      data: {
        email,
        name,
        password,
        role,
        confirmId,
      },
    });
  }

  async deleteUserTemp(email: string) {
    return await prisma.userTemp.delete({
      where: { email },
    });
  }
}

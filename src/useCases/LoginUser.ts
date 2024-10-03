import UserRepository from "../repositories/UserRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../shared/appErrors";
import { User } from "@prisma/client";
import { serverStringErrorsAndCodes } from "../utils/serverStringErrorsAndCodes";
import { LoginUserProps } from "../interfaces/interface";
import TokenService from "../services/Token/TokenService";

export class LoginUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  private async checkIfUserExists(email: string) {
    const userExists = await this.userRepository.findByEmail(email);

    if (!userExists) {
      throw new AppError(
        serverStringErrorsAndCodes.invalidEmailOrPassword.message,
        serverStringErrorsAndCodes.invalidEmailOrPassword.code
      );
    }

    return userExists;
  }

  private async checkIfPasswordIsCorrect(password: string, user: User) {
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        serverStringErrorsAndCodes.invalidEmailOrPassword.message,
        serverStringErrorsAndCodes.invalidEmailOrPassword.code
      );
    }
  }

  async execute({ email, password }: LoginUserProps) {
    const emailToLowerCase: string = email.toLowerCase();

    const user = await this.checkIfUserExists(emailToLowerCase);

    await this.checkIfPasswordIsCorrect(password, user);

    const token = TokenService.generateToken(user);

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as Partial<User>).password;

    return { userWithoutPassword, token };
  }
}

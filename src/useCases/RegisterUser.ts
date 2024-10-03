import UserRepository from "../repositories/UserRepository";
import { AppError } from "../shared/appErrors";
import { serverStringErrorsAndCodes } from "../utils/serverStringErrorsAndCodes";
import { CreateUserProps } from "../interfaces/interface";
import TokenService from "../services/Token/TokenService";
import { User } from "@prisma/client";

export class RegisterUserUseCase {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  private async checkIfUserExists(email: string) {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError(
        serverStringErrorsAndCodes.userAlreadyExists.message,
        serverStringErrorsAndCodes.userAlreadyExists.code
      );
    }

    return userExists;
  }

  async execute({ name, email, password, role }: CreateUserProps) {
    const emailToLowerCase: string = email.toLowerCase();

    await this.checkIfUserExists(emailToLowerCase);

    const user = await this.userRepository.createUser({
      name,
      email: emailToLowerCase,
      password,
      role,
    });

    const token = TokenService.generateToken(user);
    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as Partial<User>).password;

    return { userWithoutPassword, token };
  }
}

import UserRepository from "../../repositories/UserRepository";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";
import TokenService from "../../services/Token/TokenService";
import { User } from "@prisma/client";
import UserTempRepository from "../../repositories/UserTempRepository";
import dotenv from "dotenv";
dotenv.config();

export class RegisterUserUseCase {
  private userRepository: UserRepository;
  private userTempRepository: UserTempRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.userTempRepository = new UserTempRepository();
  }

  private async findTempUserByConfirmId(confirmId: string) {
    const tempUser = await this.userTempRepository.findByConfirmId(confirmId);

    if (!tempUser) {
      throw new AppError(
        serverStringErrorsAndCodes.userNotFound.message,
        serverStringErrorsAndCodes.userNotFound.code
      );
    }

    return tempUser;
  }

  async execute(confirmId: string) {
    const tempUser = await this.findTempUserByConfirmId(confirmId);

    const user = await this.userRepository.createUser({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
    });

    const token = TokenService.generateToken(user);
    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as Partial<User>).password;

    await this.userTempRepository.deleteUserTemp(tempUser.email);

    return { userWithoutPassword, token };
  }
}

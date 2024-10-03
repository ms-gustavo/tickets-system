import UserRepository from "../repositories/UserRepository";
import { AppError } from "../shared/appErrors";
import { serverStringErrorsAndCodes } from "../utils/serverStringErrorsAndCodes";

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

  async execute(name: string, email: string, password: string) {
    const emailToLowerCase: string = email.toLowerCase();

    await this.checkIfUserExists(emailToLowerCase);

    const user = await this.userRepository.createUser(
      name,
      emailToLowerCase,
      password
    );
    return user;
  }
}

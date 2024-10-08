import UserRepository from "../../repositories/UserRepository";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";

export class UserValidationService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async checkIfUserExists(email: string) {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError(
        serverStringErrorsAndCodes.userAlreadyExists.message,
        serverStringErrorsAndCodes.userAlreadyExists.code
      );
    }
  }
}

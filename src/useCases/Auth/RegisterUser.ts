import UserRepository from "../../repositories/UserRepository";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";
import { CreateUserProps } from "../../interfaces/interface";
import { v4 as uuidv4 } from "uuid";
import TokenService from "../../services/Token/TokenService";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import UserTempRepository from "../../repositories/UserTempRepository";
import { AuthRegisterEmailNotification } from "../../utils/emailMessages";
import { EmailService } from "../../services/Email/EmailService";
import dotenv from "dotenv";
dotenv.config();

export class RegisterUserUseCase {
  private userRepository: UserRepository;
  private userTempRepository: UserTempRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.userTempRepository = new UserTempRepository();
  }

  private async checkIfUserExists(email: string) {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new AppError(
        serverStringErrorsAndCodes.userAlreadyExists.message,
        serverStringErrorsAndCodes.userAlreadyExists.code
      );
    }
  }

  private async checkIfTempUserExists(email: string) {
    const userExists = await this.userTempRepository.findByEmail(email);

    if (userExists) {
      throw new AppError(
        serverStringErrorsAndCodes.userAlreadyExists.message,
        serverStringErrorsAndCodes.userAlreadyExists.code
      );
    }
  }

  private async sendConfirmationEmail(
    name: string,
    email: string,
    confirmId: string
  ) {
    const newConfirmationLink = `${process.env
      .BACKEND_URL!}/auth/confirm-registration/${confirmId}`;

    const emailContent = AuthRegisterEmailNotification({
      name,
      newConfirmationLink,
    });

    await EmailService.sendEmail({
      email,
      subject: emailContent.subject,
      text: emailContent.text,
    });
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

  async registerUser({ name, email, password, role }: CreateUserProps) {
    const emailToLowerCase: string = email.toLowerCase();

    await this.checkIfUserExists(emailToLowerCase);
    await this.checkIfTempUserExists(emailToLowerCase);

    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmId = uuidv4();
    await this.userTempRepository.createUserTemp({
      name,
      email: emailToLowerCase,
      password: hashedPassword,
      role,
      confirmId,
    });

    await this.sendConfirmationEmail(name, emailToLowerCase, confirmId);

    return { message: "Cheque seu e-mail para confirmar o cadastro" };
  }

  async confirmRegistration(confirmId: string) {
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

import { CreateUserProps } from "../../interfaces/interface";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import UserTempRepository from "../../repositories/UserTempRepository";
import { AppError } from "../../shared/appErrors";
import { serverStringErrorsAndCodes } from "../../utils/serverStringErrorsAndCodes";
import { AuthRegisterEmailNotification } from "../../utils/emailMessages";
import { EmailService } from "../../services/Email/EmailService";
import UserRepository from "../../repositories/UserRepository";
import { UserValidationService } from "../../services/UserValidation/UserValidationService";

export class RegisterTempUserUseCase {
  private userTempRepository: UserTempRepository;
  private userRepository: UserRepository;
  private userValidationService: UserValidationService;

  constructor(userTempRepository: UserTempRepository) {
    this.userTempRepository = userTempRepository;
    this.userRepository = new UserRepository();
    this.userValidationService = new UserValidationService(this.userRepository);
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

  async execute({ name, email, password, role }: CreateUserProps) {
    const emailToLowerCase: string = email.toLowerCase();
    await this.checkIfTempUserExists(emailToLowerCase);
    await this.userValidationService.checkIfUserExists(emailToLowerCase);

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
}

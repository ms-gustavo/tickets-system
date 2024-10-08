import { Request, Response } from "express";
import UserRepository from "../repositories/UserRepository";
import { LoginUserUseCase } from "../useCases/Auth/LoginUser";
import { RegisterUserUseCase } from "../useCases/Auth/RegisterUser";
import { CreateUserDTO } from "../dtos/UserDTO/create";
import { AppError } from "../shared/appErrors";
import { LoginUserDTO } from "../dtos/UserDTO/login";
import { serverStringErrorsAndCodes } from "../utils/serverStringErrorsAndCodes";

const userRepository = new UserRepository();
const registerUserUseCase = new RegisterUserUseCase(userRepository);

export class AuthController {
  async register(req: Request, res: Response) {
    const { name, email, password, role }: CreateUserDTO = req.body;

    try {
      const result = await registerUserUseCase.registerUser({
        name,
        email,
        password,
        role,
      });

      if (!result) {
        throw new AppError(
          serverStringErrorsAndCodes.registerFailed.message,
          serverStringErrorsAndCodes.registerFailed.code
        );
      }

      const { message } = result;
      res.status(200).json({
        message,
      });
      return;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message,
      });
      return;
    }
  }

  async confirmRegistration(req: Request, res: Response) {
    const { confirmId } = req.params;

    try {
      const { userWithoutPassword, token } =
        await registerUserUseCase.confirmRegistration(confirmId);
      res.status(200).json({ user: userWithoutPassword, token });
      return;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message,
      });
      return;
    }
  }

  async login(req: Request, res: Response) {
    const { email, password }: LoginUserDTO = req.body;
    const loginUserUseCase = new LoginUserUseCase(userRepository);

    try {
      const { userWithoutPassword, token } = await loginUserUseCase.execute({
        email,
        password,
      });
      res.status(200).json({ user: userWithoutPassword, token });
      return;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json({
        error: "Internal server error",
        message: (error as Error).message,
      });
      return;
    }
  }
}

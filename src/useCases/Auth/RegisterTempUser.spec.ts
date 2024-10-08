import { AppError } from "../../shared/appErrors";
import { ROLE } from "@prisma/client";
import { mockUserTempRepository } from "../../repositories/Mocks/mocksRepositories";
import { EmailService } from "../../services/Email/EmailService";
import { RegisterTempUserUseCase } from "./RegisterTempUser";
import UserTempRepository from "../../repositories/UserTempRepository";

jest.mock("../../services/Email/EmailService");
jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
}));
jest.mock("uuid", () => {
  return {
    v4: jest.fn().mockReturnValue("1234-confirm-id"),
  };
});

describe("Temp User Registration Use Case", () => {
  let registerTempUserUseCase: RegisterTempUserUseCase;
  const userData = {
    name: "Test User",
    email: "test@test.com",
    password: "password",
    role: ROLE.USER,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    registerTempUserUseCase = new RegisterTempUserUseCase(
      mockUserTempRepository as unknown as UserTempRepository
    );
  });

  it("should send an confirmation link to email", async () => {
    mockUserTempRepository.findByEmail.mockResolvedValueOnce(null);
    mockUserTempRepository.createUserTemp.mockResolvedValueOnce({
      id: "1",
      name: userData.name,
      email: userData.email,
      password: "hashedPassword",
      role: userData.role,
      confirmId: "1234-confirm-id",
    });
    const sendEmailMock = jest
      .spyOn(EmailService, "sendEmail")
      .mockResolvedValueOnce();
    const result = await registerTempUserUseCase.execute(userData);
    expect(mockUserTempRepository.findByEmail).toHaveBeenCalledWith(
      userData.email.toLowerCase()
    );
    expect(mockUserTempRepository.createUserTemp).toHaveBeenCalledWith({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: "hashedPassword",
      role: userData.role,
      confirmId: "1234-confirm-id",
    });

    expect(sendEmailMock).toHaveBeenCalledWith({
      email: userData.email.toLowerCase(),
      subject: expect.any(String),
      text: expect.any(String),
    });
    expect(result).toEqual({
      message: "Cheque seu e-mail para confirmar o cadastro",
    });
  }, 10000);

  it("should throw an error if user already exists", async () => {
    mockUserTempRepository.findByEmail.mockResolvedValueOnce({
      email: "test@test.com",
    });

    await expect(registerTempUserUseCase.execute(userData)).rejects.toThrow(
      AppError
    );
    expect(mockUserTempRepository.findByEmail).toHaveBeenCalledWith(
      userData.email.toLowerCase()
    );
  });
});

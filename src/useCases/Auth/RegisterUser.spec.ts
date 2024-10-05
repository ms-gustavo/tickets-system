import { RegisterUserUseCase } from "./RegisterUser";
import UserRepository from "../../repositories/UserRepository";
import { AppError } from "../../shared/appErrors";
import { ROLE } from "@prisma/client";
import { mockUserRepository } from "../../repositories/Mocks/mocksRepositories";

describe("User Registration Use Case", () => {
  let registerUserUseCase: RegisterUserUseCase;

  const userData = {
    name: "Test User",
    email: "test@test.com",
    password: "password",
    role: ROLE.USER,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    registerUserUseCase = new RegisterUserUseCase(
      mockUserRepository as unknown as UserRepository
    );
  });

  it("should register a new user successfully", async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    mockUserRepository.createUser.mockResolvedValue({
      id: "1",
      name: userData.name,
      email: userData.email,
      password: "hashedPassword",
      role: userData.role,
    });

    const result = await registerUserUseCase.execute(userData);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      userData.email.toLowerCase()
    );
    expect(mockUserRepository.createUser).toHaveBeenCalledWith({
      name: userData.name,
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role,
    });
    expect(result).toEqual({
      userWithoutPassword: {
        id: "1",
        name: "Test User",
        email: "test@test.com",
        role: "USER",
      },
      token: expect.any(String),
    });
  });

  it("should throw an error if user already exists", async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce({
      email: "test@test.com",
    });

    await expect(registerUserUseCase.execute(userData)).rejects.toThrow(
      AppError
    );
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      userData.email.toLowerCase()
    );
  });
});

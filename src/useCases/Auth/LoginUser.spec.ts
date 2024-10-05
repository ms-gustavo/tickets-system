import { ROLE } from "@prisma/client";
import { mockUserRepository } from "../../repositories/Mocks/mocksRepositories";
import UserRepository from "../../repositories/UserRepository";
import { LoginUserUseCase } from "./LoginUser";
import bcrypt from "bcryptjs";

describe("User Login Use Case", () => {
  let loginUserUseCase: LoginUserUseCase;

  const userData = {
    email: "test@test.com",
    password: "password",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    loginUserUseCase = new LoginUserUseCase(
      mockUserRepository as unknown as UserRepository
    );
  });

  it("should login an user successfully", async () => {
    const mockHashedPassword = await bcrypt.hash(userData.password, 10);
    mockUserRepository.findByEmail.mockResolvedValueOnce({
      id: "1",
      name: "Test User",
      email: userData.email,
      password: mockHashedPassword,
      role: ROLE.USER,
    });

    jest
      .spyOn(bcrypt, "compare")
      .mockImplementation(
        async (password: string, hash: string): Promise<boolean> => {
          return true;
        }
      );

    const result = await loginUserUseCase.execute(userData);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      userData.email.toLowerCase()
    );
    expect(result).toEqual({
      userWithoutPassword: {
        id: "1",
        name: "Test User",
        email: userData.email,
        role: "USER",
      },
      token: expect.any(String),
    });
  });
});

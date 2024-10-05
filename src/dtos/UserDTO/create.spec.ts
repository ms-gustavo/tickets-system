import "reflect-metadata";
import { validateDTO } from "../../middlewares/validate.middleware";
import { CreateUserDTO } from "./create";
import { Request, Response, NextFunction } from "express";
import { ROLE } from "@prisma/client";

describe("Create User DTO Validation", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  const middleware = validateDTO(CreateUserDTO);

  const baseRequestBody = {
    name: "Test User",
    email: "test@test.com",
    password: "password",
    role: ROLE.USER,
  };

  function removeKeyFromBody(key: string) {
    const newBody = { ...mockRequest.body };
    delete newBody[key];
    mockRequest.body = newBody;
  }

  beforeEach(() => {
    jest.clearAllMocks();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = { body: { ...baseRequestBody } };
  });

  it("should pass validation with valid data", async () => {
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should fail validation with invalid name", async () => {
    removeKeyFromBody("name");
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Erro de validação",
      errors: expect.arrayContaining([
        expect.objectContaining({
          field: "name",
          errors: expect.arrayContaining(["O nome é obrigatório"]),
        }),
      ]),
    });
  });

  it("should fail validation with invalid email", async () => {
    removeKeyFromBody("email");
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Erro de validação",
      errors: expect.arrayContaining([
        expect.objectContaining({
          field: "email",
          errors: expect.arrayContaining(["O email é obrigatório"]),
        }),
      ]),
    });
  });

  it("should fail validation with invalid password", async () => {
    removeKeyFromBody("password");
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Erro de validação",
      errors: expect.arrayContaining([
        expect.objectContaining({
          field: "password",
          errors: expect.arrayContaining(["A senha é obrigatória"]),
        }),
      ]),
    });
  });

  it("should fail validation with invalid role", async () => {
    removeKeyFromBody("role");
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Erro de validação",
      errors: expect.arrayContaining([
        expect.objectContaining({
          field: "role",
          errors: expect.arrayContaining(["O papel é obrigatório"]),
        }),
      ]),
    });
  });
});

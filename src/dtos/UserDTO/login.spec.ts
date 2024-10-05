import "reflect-metadata";
import { validateDTO } from "../../middlewares/validate.middleware";
import { LoginUserDTO } from "./login";
import { Request, Response, NextFunction } from "express";
import { removeKeyFromBody } from "../../shared/testsUtilsFunctions";

describe("Login User DTO Validation", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  const middleware = validateDTO(LoginUserDTO);

  const baseRequestBody = {
    email: "test@test.com",
    password: "password",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = { body: { ...baseRequestBody } };
  });

  it("should pass validation", async () => {
    await middleware(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );
    expect(nextFunction).toHaveBeenCalled();
  });

  it("should fail validation with invalid email", async () => {
    removeKeyFromBody(mockRequest, "email");
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
          errors: expect.arrayContaining([
            "O email é obrigatório",
            "O email é inválido",
          ]),
        }),
      ]),
    });
  });

  it("should fail validation with invalid password", async () => {
    removeKeyFromBody(mockRequest, "password");
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
});

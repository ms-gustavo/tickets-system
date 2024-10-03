import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";

export function validateDTO(DTOClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(DTOClass, req.body);

    const errors: ValidationError[] = await validate(dtoObject);

    if (errors.length > 0) {
      const formattedErrors = errors.map((error) => {
        const constraints = Object.values(error.constraints || {}).join(", ");
        return {
          field: error.property,
          error: constraints,
        };
      });

      return res.status(400).json({
        status: "error",
        message: "Erro de validação dos dados",
        details: formattedErrors,
      });
    }

    next();
  };
}

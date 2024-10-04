import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../shared/appErrors";
import { TokenPayload } from "../interfaces/interface";
import { serverStringErrorsAndCodes } from "../utils/serverStringErrorsAndCodes";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const authorize = (requiredRole: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      next(
        new AppError(
          serverStringErrorsAndCodes.tokenNotProvided.message,
          serverStringErrorsAndCodes.tokenNotProvided.code
        )
      );
      return;
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as TokenPayload;

      if (decoded.role !== requiredRole) {
        next(
          new AppError(
            serverStringErrorsAndCodes.unauthorizedAccess.message,
            serverStringErrorsAndCodes.unauthorizedAccess.code
          )
        );
        return;
      }

      req.user = { id: decoded.userId, role: decoded.role };
      next();
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ message: error.message });
        return;
      }
      res.status(500).json({
        message: "Internal server error",
        error: (error as Error).message,
      });
      return;
    }
  };
};

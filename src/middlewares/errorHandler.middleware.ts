import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/appErrors";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  res.status(500).json({
    message: "Internal server error",
    error: err.message,
  });
  return;
};

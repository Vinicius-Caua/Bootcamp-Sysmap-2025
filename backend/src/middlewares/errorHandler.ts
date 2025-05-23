import { NextFunction, Request, Response } from "express";
import { ServerError } from "../errors/serverError";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ServerError) {
    res.status(error.statusCode).json({ error: error.message });
  } else if (error.name === "FileValidationError") {
    res.status(400).json({ error: error.message });
  } else {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

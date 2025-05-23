import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ServerError } from "../errors/serverError";

export default function validateRequestBody(schema: ZodSchema) {
  return function requestBodyValidator(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    try {
      schema.parse(request.body);
      next();
    } catch (error: any) {
      throw new ServerError("Informe os campos obrigatórios corretamente.", 400);
    }
  };
}
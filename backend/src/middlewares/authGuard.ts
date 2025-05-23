import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getUserId } from "../service/userService";

const jwtSecret = process.env.JWT_SECRET!;

declare module "express-serve-static-core" {
  interface Request {
    userId: string;
  }
}

export default async function authGuard(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    response.status(401).send("Autenticação necessária.");
    return;
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify if token is valid and get userId
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    
    // Fetch user details from the service
    const user = await getUserId(decoded.userId);

    // Check if user exists
    if (!user) {
      response.status(404).send("Usuário não encontrado. Verifique o Token de acesso.");
      return;
    }

    // Check if user is deleted
    if (user.deletedAt) {
      response
        .status(403)
        .send("Esta conta foi desativada e não pode ser utilizada.");
      return;
    }

    request.userId = user.id;
    next();
  } catch (error: any) {
    response.status(401).send("Token inválido ou expirado.");
    return;
  }
}

import { Express, Router } from "express";
import authService from "../service/authService";
import { userService } from "../service/userService";
import validateRequestBody from "../middlewares/requestBodyValidator";
import authValidation from "../validations/auth/authValidation";
import userCreateValidation from "../validations/user/userCreateValidation";
import { ServerError } from "../errors/serverError";
import { grantAchievement } from "../service/userAchievementService";

const authController = (server: Express) => {
  const router = Router();

  // Endpoint for user registration
  router.post(
    "/register",
    validateRequestBody(userCreateValidation),
    async (request, response) => {
      try {
        const userData = request.body;
        await userService.createUser(userData);
        response.status(201).send({
          mensagem: "Usuário criado com sucesso.",
        });
      } catch (error: any) {
        if (error instanceof ServerError) {
          response.status(error.statusCode).send({ error: error.message });
          return;
        } else {
          response.status(500).send({ error: "Erro inesperado." });
        }
      }
    }
  );

  // Endpoint for user authentication
  router.post(
    "/sign-in",
    validateRequestBody(authValidation),
    async (request, response) => {
      try {
        const { email, password } = request.body;

        const { token, user } = await authService.authenticate(email, password);

        // Grant the "Primeiro Login" achievement        
        response.status(200).send({ token, ...user }); // Send token and user data unstructured
      } catch (error: any) {
        if (error instanceof ServerError) {
          response.status(error.statusCode).send({ error: error.message });
          return;
        }
        response.status(500).send({ error: "Erro inesperado." });
        return;
      }
    }
  );

  // Register the router with the server
  server.use("/auth", router);
};

export default authController;

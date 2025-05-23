import { Express, Router } from "express";
import { userService } from "../service/userService";
import validateRequestBody from "../middlewares/requestBodyValidator";
import userUpdateValidation from "../validations/user/userUpdateValidation";
import authGuard from "../middlewares/authGuard";
import userPreferenceDefine from "../validations/user/userPreferencesDefineValidation";
import { uploadImage } from "../service/s3Service";
import upload from "../multer/multer";
import { ServerError } from "../errors/serverError";
import { errorHandler } from "../middlewares/errorHandler";

const userController = (server: Express) => {
  const router = Router();
  router.use(authGuard);
  // router.use(checkAccountStatus);

  // Get logged-in user data
  router.get("/", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard
      const user = await userService.getUserData(userId);
      response.status(200).send(user);
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Get user preferences
  router.get("/preferences", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard
      const preferences = await userService.getUserPreferences(userId);
      response.status(200).send(preferences);
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Define user preferences
  router.post(
    "/preferences/define",
    validateRequestBody(userPreferenceDefine),
    async (request, response) => {
      try {
        const userId = request.userId; // Get userId from authGuard
        const { typeId } = request.body; // Get typeId from request body

        // Define user preferences
        const updatedPreferences = await userService.defineUserPreferences(
          userId,
          typeId
        );

        // Send the response
        response
          .status(200)
          .send({ message: "Preferências atualizadas com sucesso." });
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

  // Update user
  router.put(
    "/update",
    validateRequestBody(userUpdateValidation),
    async (request, response) => {
      try {
        const userId = request.userId; // Get userId from authGuard
        const userData = request.body;
        const user = await userService.updateUser(userId, userData);
        response.status(200).send(user);
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

  // Update user avatar
  router.put("/avatar", upload.single("avatar"), async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard
      const file = request.file; // Get file from request
      const avatarUrl = await uploadImage(file!); // Upload image to S3 and get URL

      const user = await userService.updateAvatar(userId, avatarUrl);
      response.status(200).send({ avatarUrl });
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Deactivate user
  router.delete("/deactivate", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard
      const user = await userService.deactivateUser(userId);
      response.status(200).send({ message: "Conta desativada com sucesso." });
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  server.use("/user", router);
  server.use(errorHandler);
};

export default userController;

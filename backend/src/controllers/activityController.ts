import { Express, Router, Request, Response } from "express";
import { activityService, parseAddress } from "../service/activityService";
import authGuard from "../middlewares/authGuard";
import requestBodyValidator from "../middlewares/requestBodyValidator";
import CreateActivityValidation from "../validations/activity/CreateActivityValidation";
import { approveParticipant } from "../repository/activityRepository";
import approveValidation from "../validations/activity/approveValidation";
import checkInValidation from "../validations/activity/checkInValidation";
import upload from "../multer/multer";
import { uploadImage } from "../service/s3Service";
import { errorHandler } from "../middlewares/errorHandler";
import { ServerError } from "../errors/serverError";
import updateActivityValidation from "../validations/activity/updateActivityValidation";

const activityController = (server: Express) => {
  const router = Router();
  router.use(authGuard);
  // router.use(checkAccountStatus);

  // Endpoint to list all activity types
  router.get("/types", async (request, response) => {
    try {
      const activityTypes = await activityService.getAllActivityTypes();
      response.status(200).send(activityTypes);
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Endpoint to list paginated activities
  // Ex: ?take=10&skip=5&type=Esporte&orderBy=scheduledDate&order=asc
  router.get("/", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard
      const {
        take = "10",
        skip = "0",
        type,
        orderBy,
        order,
      } = request.query as {
        take: string;
        skip: string;
        type?: string;
        orderBy?: string;
        order?: "asc" | "desc";
      };

      const activities = await activityService.getPaginatedActivities(
        userId,
        parseInt(take),
        parseInt(skip),
        type,
        orderBy,
        order
      );
      response.status(200).send(activities);
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Endpoint to list all activities with filter and order
  // Ex: ?type=Esporte&orderBy=scheduledDate&order=asc
  router.get("/all", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard
      const { type, orderBy, order } = request.query as {
        type?: string;
        orderBy?: string;
        order?: "asc" | "desc";
      };

      const activities = await activityService.getAllActivities(
        userId,
        type,
        orderBy,
        order
      );
      response.status(200).send(activities);
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Endpoint to list activities created by the user paginated
  // Ex: ?take=10&skip=5
  router.get("/user/creator", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard

      const { take = "10", skip = "0" } = request.query as {
        take: string;
        skip: string;
      };

      const activities = await activityService.getActivitiesByCreatorPaginated(
        userId,
        parseInt(take),
        parseInt(skip)
      );
      response.status(200).send(activities);
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Endpoint to list activities created by the user without pagination
  router.get("/user/creator/all", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard

      const activities = await activityService.getActivitiesByCreator(userId);
      response.status(200).send(activities);
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Endpoint to list activities the user is participating in, paginated
  router.get("/user/participant", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard

      const { take = "10", skip = "0" } = request.query as {
        take: string;
        skip: string;
      };

      const activities =
        await activityService.getActivitiesByParticipantPaginated(
          userId,
          parseInt(take),
          parseInt(skip)
        );
      response.status(200).send(activities);
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Endpoint to list all activities the user is participating in without pagination
  router.get("/user/participant/all", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard

      const activities = await activityService.getActivitiesByParticipant(
        userId
      );
      response.status(200).send(activities);
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Endpoint to list participants of a specific activity
  router.get("/:id/participants", async (request, response) => {
    try {
      const { id } = request.params; // Get activityId from request params

      const participants = await activityService.getParticipantsByActivityId(
        // Get participants by activity
        id
      );
      response.status(200).send(participants);
    } catch (error: any) {
      if (error.message === "Atividade não encontrada.") {
        response.status(404).send({ error: error.message });
      } else {
        if (error instanceof ServerError) {
          response.status(error.statusCode).send({ error: error.message });
          return;
        } else {
          response.status(500).send({ error: "Erro inesperado." });
          return;
        }
      }
    }
  });

  // Endpoint to create a new activity
  router.post(
    "/new",
    upload.single("image"),
    requestBodyValidator(CreateActivityValidation),
    async (request, response) => {
      try {
        const userId = request.userId; // Get userId from authGuard
        const file = request.file;
        const imageUrl = await uploadImage(file!);
        const { address } = request.body; // Get activity data and address from request body

        const activityData = JSON.parse(
          JSON.stringify({
            ...request.body,
            image: imageUrl, // URL S3 image
          })
        );

        const newActivity = await activityService.createActivity(
          userId,
          activityData,
          address
        );
        response.status(201).send(newActivity);
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

  // Endpoint to subscribe for an activity
  router.post("/:id/subscribe", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard
      const activityId = request.params.id; // Get activityId from request params

      const subscription = await activityService.subscribeForActivity(
        userId,
        activityId
      );
      response.status(201).send(subscription);
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Endpoint to update an activity
  router.put(
    "/:id/update",
    upload.single("image"),
    requestBodyValidator(updateActivityValidation),
    async (request, response) => {
      try {
        const userId = request.userId; // Get userId from authGuard
        const activityId = request.params.id; // Get activityId from request params
        const file = request.file; // Get file from request
        const imageUrl = file ? await uploadImage(file) : undefined; // Upload image to S3 and get URL if file exists
        const { address } = request.body; // Get activity data and address from request body

        // Convert all values in activityData to strings
        const activityData = JSON.parse(
          JSON.stringify({
            ...request.body,
            image: imageUrl, // URL da imagem do S3
          })
        );

        const updatedActivity = await activityService.updateActivity(
          userId,
          activityId,
          {
            ...activityData,
            address,
          }
        );
        response.status(200).send(updatedActivity);
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

  // Endpoint to conclude an activity
  router.put("/:id/conclude", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard
      const activityId = request.params.id; // Get activityId from request params

      const concludedActivity = await activityService.completeActivity(
        userId,
        activityId
      );
      response
        .status(200)
        .send({ message: "Atividade concluída com sucesso." });
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Endpoint to approve or deny a participant in a private activity
  router.put(
    "/:id/approve",
    requestBodyValidator(approveValidation),
    async (request, response) => {
      try {
        const userId = request.userId; // Get userId from authGuard
        const activityId = request.params.id; // Get activityId from request params
        const { participantId, approved } = request.body; // Get participantId and approved status from request body

        const result = await activityService.approveParticipant(
          userId,
          activityId,
          participantId,
          approved
        );
        if (result.approved == true) {
          response.status(200).send({
            message: "Solicitação de participação aprovada com sucesso.",
          });
        } else {
          response.status(200).send({
            message: "Solicitação de participação negada com sucesso.",
          });
        }
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

  // Endpoint to check-in for an activity
  router.put(
    "/:id/check-in",
    requestBodyValidator(checkInValidation),
    async (request, response) => {
      try {
        const userId = request.userId; // Get userId from authGuard
        const activityId = request.params.id; // Get activityId from request params
        const { confirmationCode } = request.body; // Get confirmationCode from request body

        const result = await activityService.checkInActivity(
          userId,
          activityId,
          confirmationCode
        );
        response
          .status(200)
          .send({ message: "Participação confirmada com sucesso." });
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

  // Endpoint to unsubscribe from an activity
  router.delete("/:id/unsubscribe", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard
      const activityId = request.params.id; // Get activityId from request params

      await activityService.unsubscribeFromActivity(userId, activityId);
      response
        .status(200)
        .send({ message: "Participação cancelada com sucesso." });
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  // Endpoint to delete an activity
  router.delete("/:id/delete", async (request, response) => {
    try {
      const userId = request.userId; // Get userId from authGuard
      const activityId = request.params.id; // Get activityId from request params

      await activityService.deleteActivity(userId, activityId);
      response.status(200).send({ message: "Atividade excluída com sucesso." });
    } catch (error: any) {
      if (error instanceof ServerError) {
        response.status(error.statusCode).send({ error: error.message });
        return;
      }
      response.status(500).send({ error: "Erro inesperado." });
      return;
    }
  });

  server.use("/activities", router);
  server.use(errorHandler);
};

export default activityController;

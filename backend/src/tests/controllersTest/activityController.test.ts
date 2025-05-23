import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import express, { json } from "express";
import activityController from "../../controllers/activityController";
import { errorHandler } from "../../middlewares/errorHandler";

// Mock the activityService to isolate controller logic
jest.mock("../../service/activityService", () => ({
  activityService: {
    getAllActivityTypes: jest.fn(),
    getPaginatedActivities: jest.fn(),
    getAllActivities: jest.fn(),
    getActivitiesByCreatorPaginated: jest.fn(),
    getActivitiesByCreator: jest.fn(),
    getActivitiesByParticipantPaginated: jest.fn(),
    getActivitiesByParticipant: jest.fn(),
    getParticipantsByActivityId: jest.fn(),
    createActivity: jest.fn(),
    subscribeForActivity: jest.fn(),
    updateActivity: jest.fn(),
    completeActivity: jest.fn(),
    approveParticipant: jest.fn(),
    checkInActivity: jest.fn(),
    unsubscribeFromActivity: jest.fn(),
    deleteActivity: jest.fn(),
  },
  parseAddress: jest.fn(), // Dummy function for address parsing
}));

// Mock the authGuard middleware to simulate authenticated requests
jest.mock("../../middlewares/authGuard", () =>
  jest.fn((req, res, next) => {
    req.userId = "123"; // Simulate an authenticated user with ID "123"
    next();
  })
);

// Mock the s3Service for handling image uploads
jest.mock("../../service/s3Service", () => ({
  uploadImage: jest.fn(() => "mocked-image-url"), // Mock for image upload returning a dummy URL
}));

// Mock the requestBodyValidator middleware to validate request bodies
jest.mock("../../middlewares/requestBodyValidator", () =>
  jest.fn(
    () =>
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ) => {
        // Simulate validation failure if required fields are missing
        if (!req.body.title && !req.body.description) {
          return res
            .status(400)
            .send({ error: "Informe os campos obrigatórios corretamente." });
        }
        next();
      }
  )
);

// Set up the Express server with the activityController and errorHandler
const server = express();
server.use(json());
activityController(server);
server.use(errorHandler);

// Test suite for the Activity Controller
describe("Activity Controller", () => {
  // Test suite for GET /activities/types
  describe("GET /activities/types", () => {
    test("Should return all activity types", async () => {
      const mockGetAllActivityTypes = require("../../service/activityService")
        .activityService.getAllActivityTypes;
      mockGetAllActivityTypes.mockResolvedValueOnce([
        { id: "1", name: "Esporte" },
        { id: "2", name: "Música" },
      ]);

      const response = await request(server).get("/activities/types");

      expect(response.status).toBe(200); // Expect HTTP 200 status
      expect(response.body).toEqual([
        { id: "1", name: "Esporte" },
        { id: "2", name: "Música" },
      ]); // Expect the correct activity types in the response
    });

    test("Should return 500 when an unexpected error occurs", async () => {
      const mockGetAllActivityTypes = require("../../service/activityService")
        .activityService.getAllActivityTypes;
      mockGetAllActivityTypes.mockImplementationOnce(() => {
        throw new Error("Erro inesperado."); // Simulate an unexpected error
      });

      const response = await request(server).get("/activities/types");

      expect(response.status).toBe(500); // Expect HTTP 500 status
      expect(response.body).toHaveProperty("error", "Erro inesperado."); // Expect the error message in the response
    });
  });

  // Test suite for POST /activities/new
  describe("POST /activities/new", () => {
    test("Should create a new activity and return 201", async () => {
      const mockCreateActivity = require("../../service/activityService")
        .activityService.createActivity;
      mockCreateActivity.mockResolvedValueOnce({
        id: "1",
        title: "Nova Atividade",
        description: "Descrição da atividade",
      });

      const response = await request(server).post("/activities/new").send({
        title: "Nova Atividade",
        description: "Descrição da atividade",
      });

      expect(response.status).toBe(201); // Expect HTTP 201 status
      expect(response.body).toEqual({
        id: "1",
        title: "Nova Atividade",
        description: "Descrição da atividade",
      }); // Expect the created activity in the response
    });

    test("Should return 400 when request body is invalid", async () => {
      const response = await request(server).post("/activities/new").send({});

      expect(response.status).toBe(400); // Expect HTTP 400 status
      expect(response.body).toHaveProperty(
        "error",
        "Informe os campos obrigatórios corretamente."
      ); // Expect validation error message
    });

    test("Should return 500 when an unexpected error occurs", async () => {
      const mockCreateActivity = require("../../service/activityService")
        .activityService.createActivity;
      mockCreateActivity.mockImplementationOnce(() => {
        throw new Error("Erro inesperado."); // Simulate an unexpected error
      });

      const response = await request(server).post("/activities/new").send({
        title: "Nova Atividade",
        description: "Descrição da atividade",
      });

      expect(response.status).toBe(500); // Expect HTTP 500 status
      expect(response.body).toHaveProperty("error", "Erro inesperado."); // Expect the error message in the response
    });
  });

  // Test suite for GET /activities
  describe("GET /activities", () => {
    test("Should return paginated activities", async () => {
      const mockGetPaginatedActivities =
        require("../../service/activityService").activityService
          .getPaginatedActivities;
      mockGetPaginatedActivities.mockResolvedValueOnce([
        { id: "1", title: "Atividade 1" },
        { id: "2", title: "Atividade 2" },
      ]);

      const response = await request(server).get("/activities?take=2&skip=0");

      expect(response.status).toBe(200); // Expect HTTP 200 status
      expect(response.body).toEqual([
        { id: "1", title: "Atividade 1" },
        { id: "2", title: "Atividade 2" },
      ]); // Expect the correct paginated activities in the response
    });

    test("Should return 500 when an unexpected error occurs", async () => {
      const mockGetPaginatedActivities =
        require("../../service/activityService").activityService
          .getPaginatedActivities;
      mockGetPaginatedActivities.mockImplementationOnce(() => {
        throw new Error("Erro inesperado."); // Simulate an unexpected error
      });

      const response = await request(server).get("/activities?take=2&skip=0");

      expect(response.status).toBe(500); // Expect HTTP 500 status
      expect(response.body).toHaveProperty("error", "Erro inesperado."); // Expect the error message in the response
    });
  });

  // Test suite for POST /activities/:id/subscribe
  describe("POST /activities/:id/subscribe", () => {
    test("Should subscribe to an activity and return 201", async () => {
      const mockSubscribeForActivity = require("../../service/activityService")
        .activityService.subscribeForActivity;
      mockSubscribeForActivity.mockResolvedValueOnce({
        id: "1",
        userId: "123",
        activityId: "1",
        status: "subscribed",
      });

      const response = await request(server).post("/activities/1/subscribe");

      expect(response.status).toBe(201); // Expect HTTP 201 status
      expect(response.body).toEqual({
        id: "1",
        userId: "123",
        activityId: "1",
        status: "subscribed",
      }); // Expect the subscription details in the response
    });

    test("Should return 500 when an unexpected error occurs", async () => {
      const mockSubscribeForActivity = require("../../service/activityService")
        .activityService.subscribeForActivity;
      mockSubscribeForActivity.mockImplementationOnce(() => {
        throw new Error("Erro inesperado."); // Simulate an unexpected error
      });

      const response = await request(server).post("/activities/1/subscribe");

      expect(response.status).toBe(500); // Expect HTTP 500 status
      expect(response.body).toHaveProperty("error", "Erro inesperado."); // Expect the error message in the response
    });
  });

  // Test suite for DELETE /activities/:id/delete
  describe("DELETE /activities/:id/delete", () => {
    test("Should delete an activity and return 200", async () => {
      const mockDeleteActivity = require("../../service/activityService")
        .activityService.deleteActivity;
      mockDeleteActivity.mockResolvedValueOnce(undefined);

      const response = await request(server).delete("/activities/1/delete");

      expect(response.status).toBe(200); // Expect HTTP 200 status
      expect(response.body).toHaveProperty(
        "message",
        "Atividade excluída com sucesso."
      ); // Expect success message in the response
    });

    test("Should return 500 when an unexpected error occurs", async () => {
      const mockDeleteActivity = require("../../service/activityService")
        .activityService.deleteActivity;
      mockDeleteActivity.mockImplementationOnce(() => {
        throw new Error("Erro inesperado."); // Simulate an unexpected error
      });

      const response = await request(server).delete("/activities/1/delete");

      expect(response.status).toBe(500); // Expect HTTP 500 status
      expect(response.body).toHaveProperty("error", "Erro inesperado."); // Expect the error message in the response
    });
  });
});

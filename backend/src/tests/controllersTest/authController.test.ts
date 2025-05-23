import { describe, expect, test, jest } from "@jest/globals";
import request from "supertest";
import express, { json } from "express";
import authController from "../../controllers/authController";
import { errorHandler } from "../../middlewares/errorHandler";
import { ServerError } from "../../errors/serverError";

// Mock the authService to isolate controller logic
jest.mock("../../service/authService", () => ({
  authenticate: jest.fn((email, password) => {
    // Simulate different authentication scenarios
    if (email === "notfound@example.com") {
      throw new Error("Usuário não encontrado."); // User not found
    }
    if (password !== "password123") {
      throw new Error("Senha incorreta."); // Incorrect password
    }
    return {
      token: "mocked-token",
      user: {
        id: "123",
        name: "John Doe",
        email: "john.doe@example.com",
        cpf: "12345678910",
        avatar: null,
        xp: 100,
        level: 1,
        achievements: [],
      },
    };
  }),
}));

// Mock the userService to isolate user-related logic
jest.mock("../../service/userService", () => ({
  userService: {
    createUser: jest.fn(), // Mock for user creation
    getByEmail: jest.fn(), // Mock for fetching user by email
  },
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
        if (!req.body.email || !req.body.password) {
          return res
            .status(400)
            .send({ error: "Informe os campos obrigatórios corretamente." });
        }
        next();
      }
  )
);

// Set up the Express server with the authController and errorHandler
const server = express();
server.use(json());
authController(server);
server.use(errorHandler);

// Test suite for the Auth Controller
describe("Auth Controller", () => {
  // Test suite for POST /auth/sign-in
  describe("POST /auth/sign-in", () => {
    test("Should return 200 when authentication is successful", async () => {
      const mockAuthenticate =
        require("../../service/authService").authenticate;
      mockAuthenticate.mockResolvedValueOnce({
        token: "mocked-token",
        user: {
          id: "123",
          name: "John Doe",
          email: "john.doe@example.com",
          cpf: "12345678910",
          avatar: null,
          xp: 100,
          level: 1,
          achievements: [],
        },
      });

      const response = await request(server).post("/auth/sign-in").send({
        email: "john.doe@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200); // Expect HTTP 200 status
      expect(response.body).toHaveProperty("token", "mocked-token"); // Expect token in response
      expect(response.body).toHaveProperty("id", "123"); // Expect user ID in response
    });

    test("Should return 404 when user is not found", async () => {
      const mockAuthenticate =
        require("../../service/authService").authenticate;
      mockAuthenticate.mockRejectedValueOnce(
        new ServerError("Usuário não encontrado.", 404)
      );

      const response = await request(server).post("/auth/sign-in").send({
        email: "notfound@example.com",
        password: "password123",
      });

      expect(response.status).toBe(404); // Expect HTTP 404 status
      expect(response.body).toHaveProperty("error", "Usuário não encontrado."); // Expect error message
    });

    test("Should return 401 when password is incorrect", async () => {
      const mockAuthenticate =
        require("../../service/authService").authenticate;
      mockAuthenticate.mockRejectedValueOnce(
        new ServerError("Senha incorreta.", 401)
      );

      const response = await request(server).post("/auth/sign-in").send({
        email: "john.doe@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401); // Expect HTTP 401 status
      expect(response.body).toHaveProperty("error", "Senha incorreta."); // Expect error message
    });
  });

  // Test suite for POST /auth/register
  describe("POST /auth/register", () => {
    test("Should return 201 when user is successfully registered", async () => {
      const mockCreateUser = require("../../service/userService").userService
        .createUser;
      mockCreateUser.mockResolvedValueOnce(undefined);

      const response = await request(server).post("/auth/register").send({
        name: "John Doe",
        email: "john.doe@example.com",
        cpf: "12345678910",
        password: "password123",
      });

      expect(response.status).toBe(201); // Expect HTTP 201 status
      expect(response.body).toHaveProperty(
        "mensagem",
        "Usuário criado com sucesso."
      ); // Expect success message
    });

    test("Should return 400 when request body is invalid", async () => {
      const response = await request(server).post("/auth/register").send({
        password: "password123", // Missing required fields
      });

      expect(response.status).toBe(400); // Expect HTTP 400 status
      expect(response.body).toHaveProperty(
        "error",
        "Informe os campos obrigatórios corretamente."
      ); // Expect validation error message
    });

    test("Should return 500 when an unexpected error occurs", async () => {
      const mockCreateUser = require("../../service/userService").userService
        .createUser;
      mockCreateUser.mockImplementationOnce(() => {
        throw new Error("Erro inesperado."); // Simulate unexpected error
      });

      const response = await request(server).post("/auth/register").send({
        name: "John Doe",
        email: "john.doe@example.com",
        cpf: "12345678910",
        password: "password123",
      });

      expect(response.status).toBe(500); // Expect HTTP 500 status
      expect(response.body).toHaveProperty("error", "Erro inesperado."); // Expect error message
    });
  });
});
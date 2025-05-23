import { describe, expect, test, jest } from "@jest/globals";
import request from "supertest";
import express, { json } from "express";
import userController from "../../controllers/userController";
import { errorHandler } from "../../middlewares/errorHandler";

const password = "123456";
const mockEncryptedPassword = "mocked-hash";

const userData = {
  name: "Igor",
  email: "igor@gmail.com",
  password,
};

const createdUser = {
  ...userData,
  id: "1",
  password: mockEncryptedPassword,
};

// Mock bcryptjs for password hashing
jest.mock("bcryptjs", () => ({
  hash: jest.fn(() => mockEncryptedPassword),
}));

// Mock userRepository to simulate database operations
jest.mock("../../repository/userRepository", () => ({
  create: jest.fn((data) => {
    console.log("Mock do userRepository chamado com:", data);
    return createdUser;
  }),
}));

// Mock userService methods to isolate controller logic
jest.mock("../../service/userService", () => ({
  userService: {
    getUserData: jest.fn(), 
    getUserPreferences: jest.fn(), 
    defineUserPreferences: jest.fn(), 
    updateUser: jest.fn(), 
    updateAvatar: jest.fn(), 
    deactivateUser: jest.fn(), 
  },
}));

// Mock authGuard middleware to simulate authenticated requests
jest.mock("../../middlewares/authGuard", () =>
  jest.fn(
    (req: express.Request, res: express.Response, next: express.NextFunction) =>
      next()
  )
);

// Mock requestBodyValidator middleware to validate request bodies
jest.mock("../../middlewares/requestBodyValidator", () =>
  jest.fn(() => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .send({ error: "Informe os campos obrigatórios corretamente." });
    }
    next();
  })
);

// Set up the Express server with the userController and errorHandler
const server = express();
server.use(json());
userController(server);
server.use(errorHandler);

// Test suite for the User Controller
describe("User Controller", () => {
  // Test suite for GET /user
  describe("GET /user", () => {
    test("Should return user data when request is successful", async () => {
      const mockGetUserData = require("../../service/userService").userService.getUserData;
      mockGetUserData.mockResolvedValueOnce({
        id: "123",
        name: "John Doe",
        email: "john.doe@example.com",
      });

      const response = await request(server).get("/user");

      expect(response.status).toBe(200); // Expect HTTP 200 status
      expect(response.body).toEqual({
        id: "123",
        name: "John Doe",
        email: "john.doe@example.com",
      }); // Expect correct user data in the response
    });

    test("Should return 500 when an unexpected error occurs", async () => {
      const mockGetUserData = require("../../service/userService").userService.getUserData;
      mockGetUserData.mockImplementationOnce(() => {
        throw new Error("Erro inesperado."); // Simulate unexpected error
      });

      const response = await request(server).get("/user");

      expect(response.status).toBe(500); // Expect HTTP 500 status
      expect(response.body).toHaveProperty("error", "Erro inesperado."); // Expect error message in the response
    });
  });

  // Test suite for POST /user/preferences/define
  describe("POST /user/preferences/define", () => {
    test("Should return 200 when preferences are successfully defined", async () => {
      const mockDefineUserPreferences =
        require("../../service/userService").userService.defineUserPreferences;
      mockDefineUserPreferences.mockResolvedValueOnce(undefined);

      const response = await request(server)
        .post("/user/preferences/define")
        .send({
          typeId: "1",
        });

      expect(response.status).toBe(200); // Expect HTTP 200 status
      expect(response.body).toHaveProperty(
        "message",
        "Preferências atualizadas com sucesso."
      ); // Expect success message in the response
    });

    test("Should return 400 when request body is invalid", async () => {
      const response = await request(server)
        .post("/user/preferences/define")
        .send({});

      expect(response.status).toBe(400); // Expect HTTP 400 status
      expect(response.body).toHaveProperty(
        "error",
        "Informe os campos obrigatórios corretamente."
      ); // Expect validation error message
    });

    test("Should return 500 when an unexpected error occurs", async () => {
      const mockDefineUserPreferences =
        require("../../service/userService").userService.defineUserPreferences;
      mockDefineUserPreferences.mockImplementationOnce(() => {
        throw new Error("Erro inesperado."); // Simulate unexpected error
      });

      const response = await request(server)
        .post("/user/preferences/define")
        .send({
          typeId: "1",
        });

      expect(response.status).toBe(500); // Expect HTTP 500 status
      expect(response.body).toHaveProperty("error", "Erro inesperado."); // Expect error message in the response
    });
  });

  // Test suite for PUT /user/update
  describe("PUT /user/update", () => {
    test("Should return updated user data when request is successful", async () => {
      const mockUpdateUser = require("../../service/userService").userService.updateUser;
      mockUpdateUser.mockResolvedValueOnce({
        id: "123",
        name: "John Doe Updated",
        email: "john.doe@example.com",
      });

      const response = await request(server).put("/user/update").send({
        name: "John Doe Updated",
      });

      expect(response.status).toBe(200); // Expect HTTP 200 status
      expect(response.body).toEqual({
        id: "123",
        name: "John Doe Updated",
        email: "john.doe@example.com",
      }); // Expect updated user data in the response
    });

    test("Should return 400 when request body is invalid", async () => {
      const response = await request(server).put("/user/update").send({});

      expect(response.status).toBe(400); // Expect HTTP 400 status
      expect(response.body).toHaveProperty(
        "error",
        "Informe os campos obrigatórios corretamente."
      ); // Expect validation error message
    });

    test("Should return 500 when an unexpected error occurs", async () => {
      const mockUpdateUser = require("../../service/userService").userService.updateUser;
      mockUpdateUser.mockImplementationOnce(() => {
        throw new Error("Erro inesperado."); // Simulate unexpected error
      });

      const response = await request(server).put("/user/update").send({
        name: "John Doe Updated",
      });

      expect(response.status).toBe(500); // Expect HTTP 500 status
      expect(response.body).toHaveProperty("error", "Erro inesperado."); // Expect error message in the response
    });
  });
});
import { describe, expect, test, jest } from "@jest/globals";
import authService from "../../service/authService";
import { ServerError } from "../../errors/serverError";

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked-token"),
}));

jest.mock("../../service/userAchievementService", () => ({
  grantAchievement: jest.fn(),
}));

describe("authService.authenticate", () => {
  test("Should authenticate successfully and return token and user data", async () => {
    // Mocka o retorno de getByEmail para um usuário válido
    jest
      .spyOn(require("../../repository/userRepository"), "getByEmail")
      .mockResolvedValueOnce({
        id: "123",
        name: "John Doe",
        email: "john.doe@example.com",
        password: "hashed-password",
        cpf: "12345678910",
        avatar: "avatar.png",
        xp: 100,
        level: 1,
        achievements: [],
        deletedAt: null,
      });

    // Mocka bcrypt.compare para retornar true (senha válida)
    jest.spyOn(require("bcryptjs"), "compare").mockResolvedValueOnce(true);

    // Mocka getUserAchievements para retornar conquistas do usuário
    jest
      .spyOn(require("../../repository/userRepository"), "getUserAchievements")
      .mockResolvedValueOnce([
        {
          achievement: {
            name: "Primeiro Login",
            criterion: "Primeiro acesso ao sistema",
          },
        },
      ]);

    // Mocka grantAchievement para simular a concessão de conquistas
    jest
      .spyOn(
        require("../../service/userAchievementService"),
        "grantAchievement"
      )
      .mockResolvedValueOnce(undefined);

    const result = await authService.authenticate(
      "john.doe@example.com",
      "password123"
    );

    expect(result).toEqual({
      token: "mocked-token",
      user: {
        id: "123",
        name: "John Doe",
        email: "john.doe@example.com",
        cpf: "12345678910",
        avatar: "avatar.png",
        xp: 100,
        level: 1,
        achievements: [
          {
            name: "Primeiro Login",
            criterion: "Primeiro acesso ao sistema",
          },
        ],
      },
    });

    expect(
      require("../../service/userAchievementService").grantAchievement
    ).toHaveBeenCalledWith("Primeiro Login", "123", 100);
  });

  test("Should throw 404 error if user is not found", async () => {
    // Mocka getByEmail para retornar null (usuário não encontrado)
    jest
      .spyOn(require("../../repository/userRepository"), "getByEmail")
      .mockResolvedValueOnce(null);

    await expect(
      authService.authenticate("notfound@example.com", "password123")
    ).rejects.toThrow(new ServerError("Usuário não encontrado.", 404));
  });

  test("Should throw 401 error if password is incorrect", async () => {
    // Mocka getByEmail para retornar um usuário válido
    jest
      .spyOn(require("../../repository/userRepository"), "getByEmail")
      .mockResolvedValueOnce({
        id: "123",
        name: "John Doe",
        email: "john.doe@example.com",
        password: "hashed-password",
        cpf: "12345678910",
        avatar: null,
        xp: 100,
        level: 1,
        achievements: [],
        deletedAt: null,
      });

    // Mocka bcrypt.compare para retornar false (senha inválida)
    jest.spyOn(require("bcryptjs"), "compare").mockResolvedValueOnce(false);

    await expect(
      authService.authenticate("john.doe@example.com", "wrongpassword")
    ).rejects.toThrow(new ServerError("Senha incorreta.", 401));
  });

  test("Should throw 403 error if account is deactivated", async () => {
    // Mocka o retorno de getByEmail para incluir deletedAt
    jest
      .spyOn(require("../../repository/userRepository"), "getByEmail")
      .mockResolvedValueOnce({
        id: "123",
        name: "John Doe",
        email: "john.doe@example.com",
        password: "hashed-password",
        cpf: "12345678910",
        avatar: null,
        xp: 100,
        level: 1,
        achievements: [],
        deletedAt: new Date(), // Simula que a conta está desativada
      });

    // Mocka bcrypt.compare para retornar true (senha válida)
    jest.spyOn(require("bcryptjs"), "compare").mockResolvedValueOnce(true);

    await expect(
      authService.authenticate("john.doe@example.com", "password123")
    ).rejects.toThrow(
      new ServerError(
        "Esta conta foi desativada e não pode ser utilizada.",
        403
      )
    );
  });
});

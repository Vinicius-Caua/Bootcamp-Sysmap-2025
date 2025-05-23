import bcrypt from "bcryptjs";
import {
  getByEmail,
  create,
  deactivate,
  getAll,
  getById,
  update,
  getUserDataWithAchievements,
  getUserPreferences,
  defineUserPreferences,
  updateAvatar as updateAvatarRepository,
  getByIdIncludingDeactivated,
  getByCPF,
} from "../repository/userRepository";
import userUpdateValidation from "../validations/user/userUpdateValidation";
import userCreateValidation from "../validations/user/userCreateValidation";
import userData from "../types/userData";
import prisma from "../prisma/PrismaClient";
import { ServerError } from "../errors/serverError";
import { grantAchievement } from "./userAchievementService";

// Function to get user id to use in authGuard
export async function getUserId(userId: string) {
  return await getById(userId);
}

export const userService = {
  // Create user
  async createUser(data: userData) {
    // Validate user data
    userCreateValidation.parse(data);

    const deletedUser = await getByCPF(data.cpf);
    if (deletedUser?.deletedAt) {
      throw new ServerError(
        "Esta conta foi desativada e não pode ser utilizada.",
        403
      );
    }
    // Check if email already exists, including deactivated users
    const existingEmail = await getByEmail(data.email, true); // Include deactivated users
    // Check if CPF already exists, including deactivated users
    const existingCPF = await getByCPF(data.cpf);

    if (existingEmail || existingCPF) {
      throw new ServerError(
        "O e-mail ou CPF informado já pertence a outro usuário",
        400
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Default avatar URL
    const defaultAvatarUrl = `${process.env.S3_ENDPOINT}/${process.env.BUCKET_NAME}/default-avatar.png`;

    return create({
      ...data,
      password: hashedPassword,
      xp: 0, // Default value
      level: 1, // Default value
      avatar: defaultAvatarUrl, // Default value
    });
  },

  // Update user
  async updateUser(id: string, data: userData) {
    // Validate user data
    userUpdateValidation.parse(data);
    if (data.cpf) {
      throw new ServerError("O CPF não pode ser alterado.", 400);
    }

    // Check if email or CPF is already in use by another user
    if (data.email || data.cpf) {
      const existingUser = await getByEmail(data.email);
      if (existingUser && existingUser.id !== id) {
        throw new ServerError(
          "O e-mail ou CPF informado já pertence a outro usuário.",
          400
        );
      }
    }

    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return update(data, id);
  },

  // Get user data with achievements
  async getUserData(id: string) {
    return getUserDataWithAchievements(id);
  },

  // Get user preferences
  async getUserPreferences(userId: string) {
    if (!userId) {
      throw new ServerError("Preferências não encontradas.", 404);
    }
    return await getUserPreferences(userId);
  },

  // Define user preferences
  async defineUserPreferences(userId: string, typeId: string) {
    // Try to active userPreferenceDefine, if it fails, throw an error

    // Check if typeId exists
    const typeExists = await prisma.activityType.findUnique({
      where: { id: typeId },
    });
    if (!typeExists) {
      throw new ServerError("Um ou mais IDs informados são inválidos.", 400);
    }

    // Grant achievement "Sou exigente" if user has not defined preferences before
    await grantAchievement("Sou exigente", userId, 50);

    return defineUserPreferences(userId, typeId);
  },

  // Handle avatar update
  async updateAvatar(id: string, avatarUrl: string) {
    // Grant achievement "Estou bonito hoje". First time user updates avatar
    await grantAchievement("Estou bonito hoje", id, 50);

    return updateAvatarRepository(id, avatarUrl);
  },

  // Deactivate user with validation
  async deactivateUser(id: string) {
    const user = await getByIdIncludingDeactivated(id);

    if (user?.deletedAt) {
      throw new ServerError("Usuário não encontrado", 404);
    }
    if (user?.deletedAt) {
      throw new ServerError("Esta conta já foi desativada", 400);
    }
    return deactivate(id);
  },
};

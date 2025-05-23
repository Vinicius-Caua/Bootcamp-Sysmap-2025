import prisma from "../prisma/PrismaClient";
import userData from "../types/userData";

// Find all users (not deleted)
export async function getAll() {
  return await prisma.user.findMany({
    where: {
      deletedAt: null,
    },
  });
}

// Find user by ID (not deleted)
export async function getById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

// Find user by CPF
export async function getByCPF(cpf: string) {
  return prisma.user.findUnique({
    where: { cpf },
  });
}

// Find user by ID (including deleted), for middleware use
export async function getByIdIncludingDeactivated(id: string) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

// Find user by email
export async function getByEmail(email: string, includeDeactivated = false) {
  // Include deactivated users by default
  return await prisma.user.findFirst({
    where: {
      email,
      // if includeDeactivated is false, add (deletedAt: null) to find only active users
      ...(includeDeactivated ? {} : { deletedAt: null }),
    },
  });
}

// Create new user
export async function create(data: userData) {
  return await prisma.user.create({
    data,
  });
}

// Update user
export async function update(data: userData, id: string) {
  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      cpf: true,
      avatar: true,
      xp: true,
      level: true,
    },
  });
}

// Deactivate user (soft delete)
export async function deactivate(id: string) {
  return await prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
    },
  });
}

// Get user data with achievements
export async function getUserDataWithAchievements(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      cpf: true,
      avatar: true,
      xp: true,
      level: true,
      deletedAt: true,
    },
  });

  const achievements = await prisma.userAchievement.findMany({
    where: { userId: id },
    select: {
      achievement: {
        select: {
          name: true,
          criterion: true,
        },
      },
    },
  });

  return {
    ...user,
    achievements: achievements.map((ua) => ua.achievement), // Extract achievement data from UserAchievement (ua)
  };
}

// Get user preferences
export async function getUserPreferences(userId: string) {
  const preferences = await prisma.preference.findMany({
    where: { userId },
    include: {
      activityType: true,
    },
  });

  return preferences.map((preference) => ({
    typeId: preference.activityType.id,
    typeName: preference.activityType.name,
    typeDescription: preference.activityType.description,
  }));
}

// Define user preferences
export async function defineUserPreferences(userId: string, typeId: string) {
  return await prisma.preference.upsert({
    where: { userId_typeId: { userId, typeId } },
    update: {},
    create: { userId, typeId },
  });
}

// Update user avatar
export async function updateAvatar(id: string, avatarUrl: string) {
  return await prisma.user.update({
    where: { id },
    data: { avatar: avatarUrl },
  });
}

// Get user achievements
export async function getUserAchievements(userId: string) {
  return await prisma.userAchievement.findMany({
    where: { userId },
    select: {
      achievement: {
        select: {
          name: true,
          criterion: true,
        },
      },
    },
  });
}

// Verify if user has an achievement
export async function hasUserAchievement(
  userId: string,
  achievementId: string
) {
  const achievement = await prisma.userAchievement.findFirst({
    where: {
      userId,
      achievementId,
    },
  });

  return !!achievement;
}

// Create user achievement
export async function createUserAchievement(
  userId: string,
  achievementId: string
) {
  return await prisma.userAchievement.create({
    data: {
      userId,
      achievementId,
    },
  });
}

// Add XP to user account (increment)
export async function addXPToUser(userId: string, xp: number) {
  return await prisma.user.update({
    where: { id: userId },
    data: {
      xp: {
        increment: xp, // Increment XP by the given amount
      },
    },
  });
}

// Update user level
export async function updateUserLevel(userId: string, level: number) {
  return await prisma.user.update({
    where: { id: userId },
    data: { level },
  });
}

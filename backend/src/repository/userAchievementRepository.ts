import prisma from "../prisma/PrismaClient";

export async function findAchievementByUserId(
  userId: string,
  achievementId?: string
) {
  return await prisma.userAchievement.findMany({
    where: {
      userId,
      achievementId,
    },
    include: {
      achievement: true,
    },
  });
}

export async function assignAchievementToUser(
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

export async function checkUserHasAchievement(
  userId: string,
  achievementId: string
) {
  const achievement = await prisma.userAchievement.findFirst({
    where: {
      userId,
      achievementId,
    },
  });
  return !!achievement; // Return true if the achievement exists
}

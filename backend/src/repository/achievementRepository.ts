import prisma from "../prisma/PrismaClient";
import achievementData from "../types/achievementData";

// Create achievement 
export async function createManyAchievements(data: any[]) {
  await prisma.achievement.createMany({
    data,
  });
}

// Get all achievements by name
export async function getAchievementByName(name: string) {
  return await prisma.achievement.findFirst({
    where: { name },
  });
}

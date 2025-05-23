import * as achievementRepository from "../repository/achievementRepository";
import { addXPToUser, updateUserLevel } from "../repository/userRepository";
import { grantAchievement } from "./userAchievementService";

export function calculateLevel(xp: number): number {
  // Define a base XP requirement for level 1
  const baseXP = 100;

  // Define a multiplier for the XP requirement increase per level
  const multiplier = 1.5;

  let level = 1;
  let xpLimit = baseXP;

  // Increment the level while the XP exceeds the threshold
  while (xp >= xpLimit) {
    level++;
    xpLimit += Math.floor(baseXP * Math.pow(multiplier, level - 1));
  }

  return level;
}

// Add XP to the user's account and check if the user has leveled up
export async function addXPAndCheckLevel(userId: string, xpToAdd: number) {
  // Add the XP to the user's account
  const user = await addXPToUser(userId, xpToAdd);

  // Calculate the new level based on the updated XP
  const newLevel = calculateLevel(user.xp);

  // Update the user's level if it has changed
  if (newLevel > user.level) {
    await updateUserLevel(userId, newLevel);
  }

  // Check if the user has reached a specific level
  if (newLevel === 5) {
    await grantAchievement("Nível 5", userId, 500);
  } else if (newLevel === 10) {
    await grantAchievement("Nível 10", userId, 1000);
  }

  return { xp: user.xp, level: newLevel };
}

export async function createAchievements(achievements: any[]) {
  await achievementRepository.createManyAchievements(achievements);
}

export async function getAchievementByName(name: string) {
  return await achievementRepository.getAchievementByName(name);
}

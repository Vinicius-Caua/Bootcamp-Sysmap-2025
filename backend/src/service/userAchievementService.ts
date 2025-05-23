import * as achievementRepository from "../repository/achievementRepository";
import * as userAchievementRepository from "../repository/userAchievementRepository";
import { addXPAndCheckLevel } from "./achievementService";

export async function grantAchievement(
  achievementName: string,
  userId: string,
  xpNumber: number
) {
  // Find the achievement by name
  const achievement = await achievementRepository.getAchievementByName(
    achievementName
  );

  // If the achievement does not exist, silently return
  if (!achievement) {
    return;
  }

  // Check if the user already has the achievement
  const existingAchievement =
    await userAchievementRepository.checkUserHasAchievement(
      userId,
      achievement.id
    );

  // If the user already has the achievement, do nothing
  if (existingAchievement) {
    return;
  }

  // Add XP to the user
  await addXPAndCheckLevel(userId, xpNumber);

  // Grant the achievement to the user
  await userAchievementRepository.assignAchievementToUser(
    userId,
    achievement.id
  );

  // Check if the user qualifies for "Rei das Conquistas"
  if (achievementName !== "Rei das Conquistas") {
    const userAchievements =
      await userAchievementRepository.findAchievementByUserId(userId);

    if (userAchievements.length >= 5) {
      // Grant "Rei das Conquistas" if the user has 5 or more achievements
      await grantAchievement("Rei das Conquistas", userId, 100);
    }
  }
}
import { getByCPF, getByEmail } from "../repository/userRepository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUserAchievements } from "../repository/userRepository";
import { ServerError } from "../errors/serverError";
import { grantAchievement } from "./userAchievementService";
import { addXPAndCheckLevel } from "./achievementService";

const jwtSecret = process.env.JWT_SECRET!;

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, jwtSecret, { expiresIn: "1d" });
};

const authService = {

  // Authenticate user
  async authenticate(email: string, password: string) { 
    // Find user by email (including deactivated users -> true)
    const user = await getByEmail(email, true);
    if (!user) {
      throw new ServerError("Usuário não encontrado.", 404);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ServerError("Senha incorreta.", 401);
    }

    if (user.deletedAt) {
      throw new ServerError("Esta conta foi desativada e não pode ser utilizada.", 403);
    }

    const token = generateToken(user.id);
    const achievements = await getUserAchievements(user.id);

    // Lógica de conquista de primeiro login
    await grantAchievement("Primeiro Login", user.id, 100); // Assuming 100 XP for "Primeiro Login"

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        cpf: user.cpf,
        avatar: user.avatar,
        xp: user.xp,
        level: user.level,
        achievements: achievements.map((ua) => ua.achievement),
      },
    };
  },
};

export default authService;

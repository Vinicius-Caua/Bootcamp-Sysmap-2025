import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export const loginResolver = zodResolver(loginSchema);
export default loginSchema;
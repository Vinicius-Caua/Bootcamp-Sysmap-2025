import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  email: z.string().email("Formato de email inválido"),
  cpf: z
    .string()
    .regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, {
      message: "Formato de CPF inválido",
    }),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export const registerResolver = zodResolver(registerSchema);
export default registerSchema;

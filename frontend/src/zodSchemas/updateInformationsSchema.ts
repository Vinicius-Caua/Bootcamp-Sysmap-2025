import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const updateUserInformation = z.object({
  name: z.string().optional(),
  email: z.string().email("Formato de email inválido").optional(),
  password: z
    .string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .optional()
    .or(z.literal("")),
});

export type UpdatedSchema = z.infer<typeof updateUserInformation>;
export const updatedResolver = zodResolver(updateUserInformation);
export default updateUserInformation;

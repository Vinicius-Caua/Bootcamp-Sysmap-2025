import { z } from "zod";

// Define a schema for user creation validation
const userValidation = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string().regex(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/),
  password: z.string().min(6),
  avatar: z.string().url().nullable().optional(),
}).strict({ message: "Há campos que não são aceitos nessa requisição." });;

export default userValidation;
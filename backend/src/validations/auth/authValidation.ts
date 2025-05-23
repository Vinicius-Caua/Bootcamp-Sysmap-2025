import { z } from "zod";

// Define a schema for authentication validation
const authValidation = z.object({
  email: z.string().email({ message: "Formato de email inválido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
}).strict({ message: "Há campos que não são aceitos nessa requisição." });

export default authValidation;

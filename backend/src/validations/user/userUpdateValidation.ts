import { z } from "zod";

// Define the validation schema for updating a user with custom error messages
const UserUpdateSchema = z.object({
  name: z.string().optional().refine(val => val !== "", {
    message: "Nome não pode ser vazio."
  }),
  email: z.string().email({ message: "Formato de email inválido." }).optional(),
  password: z.string().min(6, { message: "Password deve ter pelo menos 6 caracteres." }).optional()
}).strict({ message: "Há campos que não são aceitos nessa requisição." }); // Strict mode will throw an error if there are extra fields

export default UserUpdateSchema;
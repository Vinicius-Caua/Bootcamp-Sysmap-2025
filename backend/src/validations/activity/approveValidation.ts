import { z } from "zod";

const approveValidation = z.object({
  participantId: z.string().uuid({ message: "O ID do participante deve ser um UUID válido." }),
  approved: z.boolean({ message: "O campo 'approved' deve ser um valor booleano." }),
}).strict({ message: "Há campos que não são aceitos nessa requisição." });

export default approveValidation;
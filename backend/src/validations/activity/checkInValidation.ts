import { z } from "zod";

const checkInValidation = z.object({
  confirmationCode: z.string().nonempty({ message: "O código de confirmação é obrigatório." }).min(5),
}).strict({ message: "Há campos que não são aceitos nessa requisição." });

export default checkInValidation;
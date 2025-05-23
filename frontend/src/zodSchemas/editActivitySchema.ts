import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema para o objeto de localização
const addressSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Schema principal para edição de atividade
const editActivitySchema = z.object({
  title: z
    .string()
    .min(3, { message: "Título deve ter pelo menos 3 caracteres" })
    .max(100, { message: "Título não pode exceder 100 caracteres" }),
  description: z
    .string()
    .min(10, { message: "Descrição deve ter pelo menos 10 caracteres" })
    .max(1000, { message: "Descrição não pode exceder 1000 caracteres" }),
  scheduledDate: z.string().refine((date) => new Date(date) > new Date(), {
    message: "A data da atividade deve ser no futuro",
  }),
  typeId: z.string().uuid({
    message: "Tipo de atividade inválido",
  }),
  address: addressSchema,
  private: z.boolean(),
  image: z.any().optional(),
});

export type EditActivitySchema = z.infer<typeof editActivitySchema>;
export const editActivityResolver = zodResolver(editActivitySchema);
export default editActivitySchema;

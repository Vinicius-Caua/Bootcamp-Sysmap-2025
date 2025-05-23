import { z } from "zod";
import { ServerError } from "../../errors/serverError";

// Define a schema for activity update validation
const updateActivityValidation = z.object({
  title: z.string().optional(), // Title is optional
  description: z.string().optional(), // Description is optional
  typeId: z
    .string()
    .uuid("O typeId da atividade fornecido está mal-formatado.")
    .optional(), // typeId is optional and must be a valid UUID
  scheduledDate: z
    .string()
    .nonempty()
    .refine(
      (date) => {
        const parsedDate = Date.parse(date);
        return !isNaN(parsedDate) && parsedDate >= Date.now();
      },
      {
        message:
          "A data agendada deve ser uma data válida e não pode ser anterior à data de hoje.",
      }
    )
    .transform((val) => new Date(val))
    .optional(), // scheduledDate is optional
  address: z
    .string()
    .optional()
    .transform((val, ctx) => {
      try {
        if (!val) return undefined; // Allow address to be optional
        // Remove spaces and braces from the string
        const cleaned = val.replace(/[{}]/g, "").trim();

        // Split by comma
        const parts = cleaned.split(/\s*,\s*/);

        if (parts.length !== 2) {
          throw new ServerError(
            "Formato inválido. Use {latitude, longitude}",
            400
          );
        }

        // Convert to numbers
        const latitude = parseFloat(parts[0]);
        const longitude = parseFloat(parts[1]);

        if (isNaN(latitude) || isNaN(longitude)) {
          throw new ServerError("Valores devem ser números", 400);
        }

        return { latitude, longitude };
      } catch (error) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Endereço inválido: " + (error as ServerError).message,
        });
        return z.NEVER;
      }
    }),
  private: z
    .enum(["true", "false"])
    .optional()
    .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)), // Allow private to be optional
});

export default updateActivityValidation;
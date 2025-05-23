import { z } from "zod";
import ImageURLFormatValidation from "../user/ImageURLFormatValidation";
import { ServerError } from "../../errors/serverError";

const createActivityValidation = z
  .object({
    title: z.string().nonempty(),
    description: z.string().nonempty(),
    typeId: z
      .string()
      .uuid("O typeId da atividade fornecido está mal-formatado."),
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
      .transform((val) => new Date(val)),
    address: z.string().transform((val, ctx) => {
      try {
        // Remove spaces and braces from the string
        const cleaned = val.replace(/[{}]/g, "").trim();

        // Split by comma
        const parts = cleaned.split(/\s*,\s*/);

        if (parts.length !== 2) {
          throw new ServerError("Formato inválido. Use {latitude, longitude}", 400);
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
    private: z.enum(["true", "false"]).transform((val) => val === "true"),
  })

export default createActivityValidation;

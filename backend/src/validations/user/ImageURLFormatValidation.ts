import { z } from "zod";

// Define the validation schema for image URL format (PNG or JPG only)
const ImageURLFormatValidation = z
  .string()
  .url()
  .refine(
    (url) => {
      return (
        url.endsWith(".png") || url.endsWith(".jpg") || url.endsWith(".jpeg")
      );
    },
    {
      message: "A imagem deve ser um arquivo PNG ou JPG.",
    }
  );

export default ImageURLFormatValidation;

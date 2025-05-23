import multer from "multer";
import path from "path";
import { Request } from "express";

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype;

  if (
    (ext === '.jpg' || ext === '.jpeg' || ext === '.png') &&
    (mimeType === 'image/jpeg' || mimeType === 'image/png')
  ) {
    cb(null, true);
  } else {
    const error = new Error('Apenas arquivos PNG, JPG ou JPEG são permitidos.');
    error.name = "FileValidationError";
    cb(error);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
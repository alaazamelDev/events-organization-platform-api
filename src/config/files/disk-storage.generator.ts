import { diskStorage } from 'multer';
import { extname } from 'path';

export function diskStorageGenerator(destination: string) {
  return diskStorage({
    destination,
    filename: function (_req, file, cb) {
      const originalFilename = file.originalname; // Get original filename
      const ext = extname(originalFilename); // Extract extension
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + `${uniqueSuffix}${ext}`);
    },
  });
}

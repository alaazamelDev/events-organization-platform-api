import { registerAs } from '@nestjs/config';

export default registerAs('files', () => ({
  dest: process.env.FILE_UPLOAD_DEST,
  allowed_mime_types: process.env.ALLOWED_MIME_TYPES,
  file_size_limit: process.env.FILE_SIZE_LIMIT,
  attendee_profiles_storage_path: process.env.ATTENDEE_PROFILES_STORAGE_PATH,
}));

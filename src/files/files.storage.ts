import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: process.env.FILE_UPLOAD_PATH || '../file_bucket',
  filename: (_req, file, cb) => {
    const name = file.originalname.split('.')[0]?.toLowerCase();
    const extension = extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${name}-${randomName}${Date.now()}${extension}`);
  },
});

export default storage;

import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  async uploadSingleFile(file: Express.Multer.File) {
    return file;
  }

  async uploadMultipleFiles(files: Express.Multer.File[]) {
    return files;
  }
}

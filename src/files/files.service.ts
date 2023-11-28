import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  async uploadSingleFile(file: Express.Multer.File) {
    console.log(file);
    return 'data is here';
  }

  async uploadMultipleFiles(files: Express.Multer.File[]) {
    console.log(files);
    return 'data is here';
  }
}

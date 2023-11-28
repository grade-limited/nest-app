import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadSingleFileDto } from './dto/upload-single-file';
import { UploadMultipleFilesDto } from './dto/upload-multiple-files';
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

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file', { storage }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadSingleFileDto,
  })
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    if (file) return this.filesService.uploadSingleFile(file);
    else throw new BadRequestException("File doesn't exist");
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10, { storage }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadMultipleFilesDto,
    description: 'Maximum 10 files',
  })
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!!files?.length) return this.filesService.uploadMultipleFiles(files);
    else throw new BadRequestException("Files don't exist");
  }
}

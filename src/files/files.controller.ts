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

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload/single')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadSingleFileDto,
  })
  uploadSingleFile(@UploadedFile() file: Express.Multer.File) {
    if (file) return this.filesService.uploadSingleFile(file);
    else throw new BadRequestException("File doesn't exist");
  }

  @Post('upload/multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
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

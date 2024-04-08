import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('img'))
  create(@UploadedFile() img: any) {
    return this.uploadService.create(img);
  }

  @Get()
  getImgAccessToken() {
    return this.uploadService.imgAccessToken();
  }
}

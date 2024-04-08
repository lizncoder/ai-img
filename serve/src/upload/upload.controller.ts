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

  @Post('enhance')
  @UseInterceptors(FileInterceptor('img'))
  create(@UploadedFile() img: any) {
    console.log(img);
    return this.uploadService.create(img);
  }

  @Post('/process')
  @UseInterceptors(FileInterceptor('img'))
  createProcess(@UploadedFile() img: any) {
    return this.uploadService.createColor(img);
  }

  @Get()
  getImgAccessToken() {
    return this.uploadService.imgAccessToken();
  }

  @Get('test')
  test() {
    console.log('我被调用 了');
    return 'test';
  }
}

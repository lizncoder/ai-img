import { Module } from '@nestjs/common';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { join, extname } from 'path';
@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../../public/upload'),
        filename: (_, file, cb) => {
          const fn = `${new Date().getTime() + extname(file.originalname)}`;
          return cb(null, fn);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}

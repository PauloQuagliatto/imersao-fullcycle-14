import path from 'path';
import { Module } from '@nestjs/common';
import multer from 'multer';
import { VideosService } from './videos.service';
import { VideosController } from './videos.controller';
import { MulterModule } from '@nestjs/platform-express';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'upload/');
  },
  filename: (req, file, callback) => {
    callback(
      null,
      `${Date.now()}${Math.random()}${path.extname(file.originalname)}`,
    );
  },
});

@Module({
  imports: [
    MulterModule.register({
      storage,
    }),
  ],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}

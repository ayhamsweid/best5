import { Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER)
export class UploadsController {
  @Get('images')
  list() {
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    if (!fs.existsSync(uploadDir)) return [];
    const files = fs
      .readdirSync(uploadDir)
      .filter((file) => !file.startsWith('.'))
      .map((file) => ({
        name: file,
        url: `/uploads/${file}`
      }))
      .reverse();
    return files;
  }

  @Delete('images/:name')
  remove(@Param('name') name: string) {
    const uploadDir = process.env.UPLOAD_DIR || 'uploads';
    const safeName = path.basename(name);
    const fullPath = path.join(uploadDir, safeName);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return { ok: true };
    }
    return { ok: false };
  }

  @Post('images')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * Number(process.env.MAX_UPLOAD_MB || 5)
      },
      fileFilter: (_req, file, cb) => {
        const allowed = (process.env.ALLOWED_UPLOAD_MIME || 'image/png,image/jpeg,image/webp,image/gif')
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean);
        if (allowed.includes(file.mimetype)) {
          cb(null, true);
          return;
        }
        cb(new BadRequestException('Unsupported file type'), false);
      },
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadDir = process.env.UPLOAD_DIR || 'uploads';
          fs.mkdirSync(uploadDir, { recursive: true });
          cb(null, uploadDir);
        },
        filename: (_req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${Date.now()}${ext}`);
        }
      })
    })
  )
  upload(@UploadedFile() file: Express.Multer.File) {
    return { url: `/uploads/${file.filename}` };
  }
}

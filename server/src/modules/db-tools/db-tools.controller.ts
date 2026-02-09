import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Res } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { DbToolsService } from './db-tools.service';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import os from 'os';
import path from 'path';
import fs from 'fs';

@Controller('db-tools')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class DbToolsController {
  constructor(private tools: DbToolsService) {}

  @Post('backup')
  async backup(@Res() res: Response) {
    const { filePath, filename } = await this.tools.backup();
    res.download(filePath, filename, (err) => {
      fs.unlink(filePath, () => null);
      if (err) {
        res.status(500).send(err.message || 'Download failed');
      }
    });
  }

  @Post('restore')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, os.tmpdir()),
        filename: (_req, file, cb) => cb(null, `restore-${Date.now()}${path.extname(file.originalname) || '.sql'}`)
      })
    })
  )
  async restore(@UploadedFile() file: Express.Multer.File) {
    await this.tools.restore(file.path);
    fs.unlink(file.path, () => null);
    return { ok: true };
  }
}

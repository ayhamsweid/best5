import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
const sharp = require('sharp');

const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);
const allowedExtensions = new Set(['.gif', '.jpeg', '.jpg', '.png', '.webp']);

export const imageUploadOptions = () => ({
  limits: {
    fileSize: 1024 * 1024 * Math.max(1, Number(process.env.MAX_UPLOAD_MB || 5)),
    files: 1,
    fields: 5,
    parts: 6,
    fieldNameSize: 100,
    fieldSize: 16 * 1024
  },
  fileFilter: (_req: unknown, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    const extension = path.extname(file.originalname).toLowerCase();
    if (!allowedMimeTypes.has(file.mimetype) || !allowedExtensions.has(extension)) {
      cb(new BadRequestException('Unsupported image type'), false);
      return;
    }
    cb(null, true);
  },
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = process.env.UPLOAD_DIR || 'uploads';
      fs.mkdirSync(uploadDir, { recursive: true });
      cb(null, uploadDir);
    },
    filename: (_req, _file, cb) => cb(null, `${randomUUID()}.upload`)
  })
});

export const processUploadedImage = async (file?: Express.Multer.File) => {
  if (!file?.path) throw new BadRequestException('Image file is required');
  const uploadDir = process.env.UPLOAD_DIR || 'uploads';
  const outputName = `${randomUUID()}.webp`;
  const outputPath = path.join(uploadDir, outputName);

  try {
    const image = sharp(file.path, {
      failOn: 'warning',
      limitInputPixels: Math.max(1, Number(process.env.MAX_IMAGE_PIXELS || 40_000_000)),
      animated: false
    });
    const metadata = await image.metadata();
    if (!metadata.format || !['jpeg', 'png', 'webp', 'gif'].includes(metadata.format)) {
      throw new BadRequestException('File content is not a supported image');
    }
    await image.rotate().webp({ quality: 84, effort: 4 }).toFile(outputPath);
    fs.rmSync(file.path, { force: true });
    file.path = outputPath;
    file.filename = outputName;
    file.mimetype = 'image/webp';
    file.size = fs.statSync(outputPath).size;
    return file;
  } catch (error) {
    fs.rmSync(file.path, { force: true });
    fs.rmSync(outputPath, { force: true });
    if (error instanceof BadRequestException) throw error;
    throw new BadRequestException('Invalid or unsafe image');
  }
};

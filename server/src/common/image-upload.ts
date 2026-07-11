import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';

const extensionAliases: Record<string, string[]> = {
  '.gif': ['gif'],
  '.jpeg': ['jpeg'],
  '.jpg': ['jpeg'],
  '.png': ['png'],
  '.webp': ['webp']
};

const detectImageType = (header: Buffer) => {
  if (header.length >= 8 && header.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'png';
  }
  if (header.length >= 3 && header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff) {
    return 'jpeg';
  }
  const prefix = header.subarray(0, 6).toString('ascii');
  if (prefix === 'GIF87a' || prefix === 'GIF89a') {
    return 'gif';
  }
  if (
    header.length >= 12 &&
    header.subarray(0, 4).toString('ascii') === 'RIFF' &&
    header.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return 'webp';
  }
  return null;
};

const availableFilename = (uploadDir: string, originalName: string) => {
  const extension = path.extname(originalName).toLowerCase();
  const rawBase = path.basename(originalName, path.extname(originalName));
  const safeBase = rawBase
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}._-]+/gu, '-')
    .replace(/^[._-]+|[._-]+$/g, '')
    .slice(0, 120) || 'image';

  let candidate = `${safeBase}${extension}`;
  let suffix = 1;
  while (fs.existsSync(path.join(uploadDir, candidate))) {
    candidate = `${safeBase}_${suffix}${extension}`;
    suffix += 1;
  }
  return candidate;
};

export const imageUploadOptions = () => ({
  limits: {
    fileSize: 1024 * 1024 * Math.max(1, Number(process.env.MAX_UPLOAD_MB || 5)),
    files: 1,
    fields: 5,
    parts: 6
  },
  fileFilter: (_req: unknown, file: Express.Multer.File, cb: (error: Error | null, acceptFile: boolean) => void) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeAllowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.mimetype);
    if (!mimeAllowed || !extensionAliases[extension]) {
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
    filename: (_req, file, cb) => {
      const uploadDir = process.env.UPLOAD_DIR || 'uploads';
      cb(null, availableFilename(uploadDir, file.originalname));
    }
  })
});

export const assertSafeUploadedImage = (file?: Express.Multer.File) => {
  if (!file?.path) {
    throw new BadRequestException('Image file is required');
  }

  const descriptor = fs.openSync(file.path, 'r');
  const header = Buffer.alloc(16);
  let bytesRead = 0;
  try {
    bytesRead = fs.readSync(descriptor, header, 0, header.length, 0);
  } finally {
    fs.closeSync(descriptor);
  }

  const detected = detectImageType(header.subarray(0, bytesRead));
  const extension = path.extname(file.filename).toLowerCase();
  if (!detected || !extensionAliases[extension]?.includes(detected)) {
    fs.rmSync(file.path, { force: true });
    throw new BadRequestException('File content does not match an allowed image type');
  }
};

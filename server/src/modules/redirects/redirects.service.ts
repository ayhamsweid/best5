import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const allowedStatusCodes = new Set([301, 302, 307, 308]);

export const normalizeRedirectPath = (value: string) => {
  try {
    const pathname = new URL(value, 'http://internal').pathname.replace(/\/+$/, '') || '/';
    return pathname
      .split('/')
      .map((part) => {
        try {
          return decodeURIComponent(part);
        } catch {
          return part;
        }
      })
      .join('/');
  } catch {
    return null;
  }
};

export const encodeRedirectPath = (value: string) =>
  value
    .split('/')
    .map((part) => encodeURIComponent(part))
    .join('/');

@Injectable()
export class RedirectsService {
  constructor(private readonly prisma: PrismaService) {}

  async resolve(path: string) {
    const oldPath = normalizeRedirectPath(path);
    if (!oldPath) return null;

    const first = await this.prisma.redirect.findUnique({ where: { old_path: oldPath } });
    if (!first?.active) return null;

    let finalPath = normalizeRedirectPath(first.new_path);
    if (!finalPath || finalPath === oldPath) return null;

    const visited = new Set([oldPath]);
    for (let depth = 0; ; depth += 1) {
      if (depth >= 20) return null;
      if (visited.has(finalPath)) return null;
      visited.add(finalPath);
      const next = await this.prisma.redirect.findUnique({ where: { old_path: finalPath } });
      if (!next?.active) break;
      const normalizedNext = normalizeRedirectPath(next.new_path);
      if (!normalizedNext) return null;
      finalPath = normalizedNext;
    }

    return {
      old_path: oldPath,
      new_path: finalPath,
      location: encodeRedirectPath(finalPath),
      status_code: allowedStatusCodes.has(first.status_code) ? first.status_code : 301
    };
  }
}

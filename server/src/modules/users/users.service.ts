import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PostStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  private safeSelect = {
    id: true,
    full_name: true,
    email: true,
    role: true,
    is_active: true,
    last_login_at: true,
    author_slug: true,
    author_title_ar: true,
    author_title_en: true,
    author_bio_ar: true,
    author_bio_en: true,
    author_expertise_ar: true,
    author_expertise_en: true,
    author_image_url: true,
    author_website_url: true,
    author_social_url: true,
    author_verified: true,
    show_public_profile: true,
    created_at: true
  } as const;

  private normalizeProfile(data: UpdateUserDto) {
    const normalized = { ...data };
    if ('author_slug' in normalized) {
      const slug = String(normalized.author_slug || '')
        .toLowerCase()
        .trim()
        .replace(/[^\p{L}\p{N}\s-]/gu, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 80);
      normalized.author_slug = slug || null;
    }
    for (const key of [
      'author_title_ar',
      'author_title_en',
      'author_bio_ar',
      'author_bio_en',
      'author_image_url',
      'author_website_url',
      'author_social_url'
    ] as const) {
      if (key in normalized) {
        const value = String(normalized[key] || '').trim();
        normalized[key] = value || null;
      }
    }
    normalized.author_expertise_ar = normalized.author_expertise_ar?.map((item) => item.trim()).filter(Boolean);
    normalized.author_expertise_en = normalized.author_expertise_en?.map((item) => item.trim()).filter(Boolean);
    for (const key of ['author_website_url', 'author_social_url'] as const) {
      const value = normalized[key];
      if (!value) continue;
      try {
        const url = new URL(value);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      } catch {
        throw new BadRequestException(`${key} must be a valid HTTP or HTTPS URL.`);
      }
    }
    if (normalized.author_image_url && !normalized.author_image_url.startsWith('/')) {
      try {
        const url = new URL(normalized.author_image_url);
        if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
      } catch {
        throw new BadRequestException('author_image_url must be a local path or a valid HTTP/HTTPS URL.');
      }
    }
    return normalized;
  }

  list() {
    return this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      select: this.safeSelect
    });
  }

  async update(id: string, data: UpdateUserDto) {
    const normalized = this.normalizeProfile(data);
    if (normalized.show_public_profile && !normalized.author_slug) {
      const existing = await this.prisma.user.findUnique({
        where: { id },
        select: { author_slug: true }
      });
      if (!existing?.author_slug) {
        throw new BadRequestException('A unique author slug is required before publishing the profile.');
      }
    }
    return this.prisma.user.update({
      where: { id },
      data: normalized,
      select: this.safeSelect
    });
  }

  publicList() {
    return this.prisma.user.findMany({
      where: {
        is_active: true,
        show_public_profile: true,
        author_slug: { not: null }
      },
      select: { author_slug: true, updated_at: true }
    });
  }

  async publicBySlug(slug: string) {
    const author = await this.prisma.user.findFirst({
      where: {
        author_slug: slug,
        is_active: true,
        show_public_profile: true
      },
      select: {
        full_name: true,
        author_slug: true,
        author_title_ar: true,
        author_title_en: true,
        author_bio_ar: true,
        author_bio_en: true,
        author_expertise_ar: true,
        author_expertise_en: true,
        author_image_url: true,
        author_website_url: true,
        author_social_url: true,
        author_verified: true,
        updated_at: true,
        posts: {
          where: { status: PostStatus.PUBLISHED, published_at: { not: null } },
          orderBy: { published_at: 'desc' },
          select: {
            id: true,
            title_ar: true,
            title_en: true,
            slug_ar: true,
            slug_en: true,
            excerpt_ar: true,
            excerpt_en: true,
            cover_image_url: true,
            published_at: true,
            content_reviewed_at: true
          }
        }
      }
    });
    if (!author) throw new NotFoundException('Author profile not found');
    return author;
  }

  async create(data: CreateUserDto) {
    const hash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        full_name: data.full_name,
        email: data.email,
        role: data.role,
        password_hash: hash,
        is_active: data.is_active ?? true
      },
      select: this.safeSelect
    });
  }

  async resetPassword(id: string, password: string) {
    const hash = await bcrypt.hash(password, 10);
    return this.prisma.user.update({
      where: { id },
      data: { password_hash: hash },
      select: this.safeSelect
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id }, select: this.safeSelect });
  }
}

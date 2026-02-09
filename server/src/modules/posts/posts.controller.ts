import { BadRequestException, Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostStatus, UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { LogsService } from '../logs/logs.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';

@Controller('posts')
export class PostsController {
  constructor(private posts: PostsService, private logs: LogsService, private notifications: NotificationsService) {}

  @Get('public')
  publicList(@Query('lang') lang?: string, @Query('category') category?: string) {
    const safeLang = lang === 'en' ? 'en' : 'ar';
    return this.posts.publicList(safeLang, category);
  }

  @Get('public/:slug')
  publicDetail(@Param('slug') slug: string, @Query('lang') lang?: string) {
    const safeLang = lang === 'en' ? 'en' : 'ar';
    return this.posts.publicBySlug(safeLang, slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER, UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  @Get()
  list() {
    return this.posts.list();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER, UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  @Get('preview/:id')
  preview(@Param('id') id: string) {
    return this.posts.previewById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER, UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.posts.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER, UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  @Post()
  async create(@Body() dto: CreatePostDto, @CurrentUser() user: any) {
    if ((dto.status === PostStatus.PUBLISHED || dto.status === PostStatus.SCHEDULED) && ![UserRole.ADMIN, UserRole.CHIEF_EDITOR].includes(user.role)) {
      throw new ForbiddenException('Only admin or chief editor can publish');
    }
    if (dto.status === PostStatus.SCHEDULED && !dto.scheduled_at) {
      throw new BadRequestException('scheduled_at is required for scheduled posts');
    }
    const created = await this.posts.create(user.id, dto);
    await this.posts.createRevision(created, user.id);
    if (dto.status === PostStatus.REVIEW) {
      await this.notifications.notifyRoles([UserRole.ADMIN, UserRole.CHIEF_EDITOR], {
        title: 'Post awaiting review',
        body: created.title_en || created.title_ar,
        href: `/admin/posts/edit/${created.id}`
      });
    }
    if (dto.status === PostStatus.SCHEDULED) {
      await this.notifications.notifyRoles([UserRole.ADMIN, UserRole.CHIEF_EDITOR], {
        title: 'Post scheduled',
        body: created.title_en || created.title_ar,
        href: `/admin/posts/edit/${created.id}`
      });
    }
    await this.logs.log(user.id, 'CREATE', 'POST', created.id, null, created);
    return created;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER, UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto, @CurrentUser() user: any) {
    if ((dto.status === PostStatus.PUBLISHED || dto.status === PostStatus.SCHEDULED) && ![UserRole.ADMIN, UserRole.CHIEF_EDITOR].includes(user.role)) {
      throw new ForbiddenException('Only admin or chief editor can publish');
    }
    if (dto.status === PostStatus.SCHEDULED && !dto.scheduled_at) {
      throw new BadRequestException('scheduled_at is required for scheduled posts');
    }
    const before = await this.posts.findOne(id);
    if (before) {
      await this.posts.createRevision(before, user.id);
    }
    const updated = await this.posts.update(id, dto);
    if (dto.status === PostStatus.REVIEW) {
      await this.notifications.notifyRoles([UserRole.ADMIN, UserRole.CHIEF_EDITOR], {
        title: 'Post awaiting review',
        body: updated.title_en || updated.title_ar,
        href: `/admin/posts/edit/${updated.id}`
      });
    }
    if (dto.status === PostStatus.SCHEDULED) {
      await this.notifications.notifyRoles([UserRole.ADMIN, UserRole.CHIEF_EDITOR], {
        title: 'Post scheduled',
        body: updated.title_en || updated.title_ar,
        href: `/admin/posts/edit/${updated.id}`
      });
    }
    await this.logs.log(user.id, 'UPDATE', 'POST', id, before, updated);
    return updated;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER)
  @Post(':id/cover')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const uploadDir = process.env.UPLOAD_DIR || 'uploads';
          const fs = require('fs');
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
  async uploadCover(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @CurrentUser() user: any) {
    const before = await this.posts.findOne(id);
    const updated = await this.posts.update(id, { cover_image_url: `/uploads/${file.filename}` });
    await this.logs.log(user.id, 'UPDATE', 'POST', id, before, updated);
    return updated;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER, UserRole.EDITOR, UserRole.CHIEF_EDITOR)
  @Get(':id/revisions')
  listRevisions(@Param('id') id: string) {
    return this.posts.listRevisions(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CHIEF_EDITOR)
  @Post(':id/revisions/:revisionId/restore')
  async restoreRevision(@Param('id') id: string, @Param('revisionId') revisionId: string, @CurrentUser() user: any) {
    const before = await this.posts.findOne(id);
    const updated = await this.posts.restoreRevision(id, revisionId);
    await this.logs.log(user.id, 'UPDATE', 'POST', id, before, updated);
    return updated;
  }
}

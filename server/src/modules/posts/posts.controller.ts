import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { LogsService } from '../logs/logs.service';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';

@Controller('posts')
export class PostsController {
  constructor(private posts: PostsService, private logs: LogsService) {}

  @Get('public')
  publicList(@Query('lang') lang?: string) {
    return this.posts.publicList();
  }

  @Get('public/:slug')
  publicDetail(@Param('slug') slug: string, @Query('lang') lang?: string) {
    const safeLang = lang === 'en' ? 'en' : 'ar';
    return this.posts.publicBySlug(safeLang, slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER)
  @Get()
  list() {
    return this.posts.list();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER)
  @Get(':id')
  get(@Param('id') id: string) {
    return this.posts.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER)
  @Post()
  async create(@Body() dto: CreatePostDto, @CurrentUser() user: any) {
    const created = await this.posts.create(user.id, dto);
    await this.logs.log(user.id, 'CREATE', 'POST', created.id, null, created);
    return created;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.CONTENT_WRITER)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePostDto, @CurrentUser() user: any) {
    const before = await this.posts.findOne(id);
    const updated = await this.posts.update(id, dto);
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
}

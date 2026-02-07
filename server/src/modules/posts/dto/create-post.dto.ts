import { IsArray, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PostStatus } from '@prisma/client';

export class CreatePostDto {
  @IsString()
  title_ar!: string;

  @IsString()
  title_en!: string;

  @IsString()
  excerpt_ar!: string;

  @IsString()
  excerpt_en!: string;

  @IsOptional()
  @IsString()
  content_ar?: string;

  @IsOptional()
  @IsString()
  content_en?: string;

  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @IsOptional()
  @IsString()
  category_id?: string;

  @IsOptional()
  @IsDateString()
  published_at?: string;

  @IsOptional()
  @IsDateString()
  scheduled_at?: string;

  @IsOptional()
  @IsArray()
  content_blocks_json?: any[];
}

import { IsArray, IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @IsOptional()
  @IsString()
  author_slug?: string | null;

  @IsOptional()
  @IsString()
  author_title_ar?: string | null;

  @IsOptional()
  @IsString()
  author_title_en?: string | null;

  @IsOptional()
  @IsString()
  author_bio_ar?: string | null;

  @IsOptional()
  @IsString()
  author_bio_en?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  author_expertise_ar?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  author_expertise_en?: string[];

  @IsOptional()
  @IsString()
  author_image_url?: string | null;

  @IsOptional()
  @IsString()
  author_website_url?: string | null;

  @IsOptional()
  @IsString()
  author_social_url?: string | null;

  @IsOptional()
  @IsBoolean()
  author_verified?: boolean;

  @IsOptional()
  @IsBoolean()
  show_public_profile?: boolean;
}

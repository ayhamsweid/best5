import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name_ar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  name_en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug_ar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug_en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  seo_title_ar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  seo_title_en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  seo_desc_ar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(320)
  seo_desc_en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  intro_ar?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  intro_en?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  icon?: string | null;
}

import { IsIn, IsObject, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(32)
  ga4_measurement_id?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  site_name_ar?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  site_name_en?: string | null;

  @IsOptional()
  @IsIn(['ar', 'en'])
  default_language?: string | null;

  @IsOptional()
  @IsObject()
  home_json?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  header_json?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  footer_json?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  pages_json?: Record<string, unknown> | null;

  @IsOptional()
  @IsObject()
  pages_meta_json?: Record<string, unknown> | null;
}

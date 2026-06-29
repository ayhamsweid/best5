import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MaxLength(120)
  name_ar!: string;

  @IsString()
  @MaxLength(120)
  name_en!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  icon?: string | null;
}

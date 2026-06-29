import { IsString, MaxLength } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @MaxLength(120)
  name_ar!: string;

  @IsString()
  @MaxLength(120)
  name_en!: string;
}

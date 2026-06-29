import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class TrackPageViewDto {
  @IsString()
  @MaxLength(2048)
  path!: string;

  @IsOptional()
  @IsIn(['ar', 'en'])
  lang?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  referrer?: string;
}

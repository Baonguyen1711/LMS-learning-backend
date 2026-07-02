import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTheoremDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  latexContent?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  storagePath?: string;

  @IsString()
  ownerId: string;
}

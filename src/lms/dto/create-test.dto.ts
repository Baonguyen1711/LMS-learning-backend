import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTestDto {
  @IsString()
  @MinLength(2)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['multiple-choice', 'short-text', 'long-text'])
  questionType: 'multiple-choice' | 'short-text' | 'long-text';

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  gradeLevel?: string;

  @IsOptional()
  @IsString()
  hashtags?: string;

  @IsOptional()
  @IsString()
  answerFormat?: string;

  @IsOptional()
  @IsString()
  latexTemplate?: string;

  @IsString()
  ownerId: string;
}

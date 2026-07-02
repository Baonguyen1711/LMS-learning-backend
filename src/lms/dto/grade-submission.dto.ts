import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class GradeSubmissionDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsOptional()
  @IsString()
  feedback?: string;

  @IsString()
  gradedById: string;
}

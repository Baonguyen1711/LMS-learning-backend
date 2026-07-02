import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  testId: string;

  @IsOptional()
  @IsString()
  gradeId?: string;

  @IsOptional()
  @IsString()
  classId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsBoolean()
  showAnswersAfterSubmission?: boolean;

  @IsOptional()
  @IsNumber()
  maxRetries?: number;

  @IsOptional()
  @IsString()
  displayMode?: 'all-at-once' | 'one-by-one';

  @IsOptional()
  @IsBoolean()
  antiCheatEnabled?: boolean;

  @IsString()
  createdById: string;
}

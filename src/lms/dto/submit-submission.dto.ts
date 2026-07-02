import { IsObject, IsOptional, IsString } from 'class-validator';

export class SubmitSubmissionDto {
  @IsString()
  assignmentId: string;

  @IsString()
  studentId: string;

  @IsOptional()
  @IsObject()
  answers?: Record<string, unknown>;
}

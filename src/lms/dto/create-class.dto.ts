import { IsString, MinLength } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  gradeId: string;

  @IsString()
  teacherId: string;
}

import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  content: string;

  @IsString()
  targetType: string;

  @IsString()
  targetId: string;

  @IsString()
  authorId: string;
}

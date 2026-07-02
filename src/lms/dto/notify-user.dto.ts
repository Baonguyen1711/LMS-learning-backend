import { IsOptional, IsString } from 'class-validator';

export class NotifyUserDto {
  @IsString()
  userId: string;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  kind?: string;
}

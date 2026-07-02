import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsOptional()
  @IsString()
  picture?: string;

  @IsOptional()
  @IsEnum(['admin', 'teacher', 'assistant-teacher', 'student'])
  role?: UserRole;
}

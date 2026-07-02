import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  role: string;

  @IsOptional()
  profile?: {
    email: string;
    name: string;
    picture?: string;
    googleId?: string;
  };
}

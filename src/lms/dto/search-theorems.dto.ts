import { IsOptional, IsString } from 'class-validator';

export class SearchTheoremsDto {
  @IsOptional()
  @IsString()
  query?: string;
}

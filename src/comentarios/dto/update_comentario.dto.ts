import { IsOptional, IsString } from 'class-validator';

export class UpdateComentarioDto {
  @IsOptional()
  @IsString()
  texto?: string;
}
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString() @IsNotEmpty() titulo: string;
  @IsString() @IsNotEmpty() descripcion: string;
  @IsOptional() imagenUrl?: string; // se completará después de subir la imagen
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'Titulo del post' })
  @IsString({ message: 'El título debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El título es obligatorio.' })
  titulo: string;

  @ApiProperty({ example: 'Descripcion del post' })
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'La descripción es obligatoria.' })
  descripcion: string;

  @ApiProperty({ example: 'https://ejemplo.com/imagen.jpg' })
  @IsOptional({ message: 'La imagen es opcional.' })
  imagenUrl?: string; // se completará después de subir la imagen
}

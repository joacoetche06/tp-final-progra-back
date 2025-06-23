import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  MaxLength,
  IsOptional,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Joaquin' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nombre: string;

  @ApiProperty({ example: 'Etchegaray' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  apellido: string;

  @ApiProperty({ example: 'joaco@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  correo: string;

  @ApiProperty({ example: 'joaco123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'El nombre de usuario solo puede contener letras, números y guiones bajos',
  })
  nombreUsuario: string;

  @ApiProperty({
    example: 'Joaco1234',
    description: 'Debe tener al menos 8 caracteres, una mayúscula y un número.',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9_]{8,}$/, {
    message:
      'La contraseña debe contener al menos 8 caracteres, una mayúscula y un número.',
  })
  password: string;

  @ApiPropertyOptional({
    example: 'Soy un desarrollador de software',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'date',
    example: '2002-11-21',
  })
  @IsOptional()
  @Type(() => Date)
  fechaNacimiento?: Date;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Imagen de perfil (formato archivo)',
  })
  imagenPerfil?: any; // no se valida con class-validator
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsIn, IsOptional, IsDateString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Nombre del usuario' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'Apellido del usuario' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @IsEmail()
  correo: string;

  @ApiProperty({ description: 'Nombre de usuario' })
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @ApiProperty({ description: 'Contraseña del usuario' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ 
    description: 'Perfil del usuario',
    enum: ['admin', 'user'],
    example: 'user'
  })
  @IsIn(['admin', 'user'])
  perfil: string;

  @ApiProperty({ description: 'Descripción del usuario', required: false })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ description: 'Fecha de nacimiento (YYYY-MM-DD)', required: false })
  @IsDateString()
  @IsOptional()
  fechaNacimiento?: Date;
}
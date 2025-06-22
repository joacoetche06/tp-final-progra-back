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

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(50, { message: 'El nombre debe tener como maximo 50 caracteres' })
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser texto' })
  @MaxLength(20, {
    message: 'El apellido debe tener como maximo 20 caracteres',
  })
  apellido: string;

  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email debe ser un correo electronico válido' })
  correo: string;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString({ message: 'El nombre de usuario debe ser texto' })
  @MinLength(3, {
    message: 'El nombre de usuario debe tener como minimo 3 caracteres',
  })
  @MaxLength(20, {
    message: 'El nombre de usuario debe tener como maximo 20 caracteres',
  })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message:
      'El nombre de usuario solo puede contener letras, números y guiones bajos',
  })
  nombreUsuario: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, {
    message: 'La contraseña debe tener como minimo 6 caracteres',
  })
  @Matches(/^(?=.*[A-Z])(?=.*\d)[a-zA-Z0-9_]{8,}$/, {
    message:
      'La contraseña debe contener al menos 8 caracteres, una mayúscula y un número.',
  })
  password: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  fechaNacimiento?: Date;
}

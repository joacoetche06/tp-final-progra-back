import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El nombre de usuario o correo es obligatorio' })
  @IsString({ message: 'Debe ser un texto' })
  readonly nombreUsuarioOEmail: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'Debe ser un texto' })
  readonly password: string;
}

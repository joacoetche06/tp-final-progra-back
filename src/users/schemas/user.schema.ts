import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ example: 'Joaquín' })
  @Prop({ required: true, trim: true })
  nombre: string;

  @ApiProperty({ example: 'Etchegaray' })
  @Prop({ required: true, trim: true })
  apellido: string;

  @ApiProperty({ example: 'joaco@gmail.com' })
  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  correo: string;

  @ApiProperty({ example: 'joaco123' })
  @Prop({ required: true, unique: true })
  nombreUsuario: string;

  @ApiProperty({ example: '********' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ example: 'Soy desarrollador' })
  @Prop()
  descripcion: string;

  @ApiProperty({ example: '2002-11-21' })
  @Prop()
  fechaNacimiento: Date;

  @ApiProperty({ example: 'user' })
  @Prop({ default: 'user' })
  perfil: string;

  @ApiProperty({ example: '/uploads/foto.png' })
  @Prop({ default: null })
  imagenPerfilUrl: string;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

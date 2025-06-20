// TODO VER SI LA CARPETA SCHEMAS DEBE IR DENTRO DE LA CARPETA USERS

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  apellido: string;

  @Prop({ required: true, unique: true, trim: true, lowercase: true })
  correo: string;

  @Prop({ required: true, unique: true })
  nombreUsuario: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  descripcion: string;

  @Prop()
  fechaNacimiento: Date;

  @Prop({ default: 'user' })
  perfil: string;

  @Prop({ default: null })
  imagenPerfilUrl: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

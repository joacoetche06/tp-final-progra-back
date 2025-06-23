import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @ApiProperty({ example: 'Título del post' })
  @Prop({ required: true })
  titulo: string;

  @ApiProperty({ example: 'Esta es la descripción del post' })
  @Prop({ required: true })
  descripcion: string;

  @ApiProperty({ example: '/uploads/imagen.jpg', required: false })
  @Prop()
  imagenUrl?: string;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  activo: boolean;

  @ApiProperty({ type: String })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  autor: Types.ObjectId;

  @ApiProperty({ type: [String] })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  meGusta: Types.ObjectId[];

  @ApiProperty({ example: new Date().toISOString() })
  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @ApiProperty({ example: new Date().toISOString() })
  @Prop({ default: Date.now })
  fechaActualizacion: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

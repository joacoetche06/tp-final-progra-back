import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type ComentarioDocument = Comentario & Document;


@Schema({ timestamps: true })
export class Comentario {
  @ApiProperty({ example: 'Contenido del comentario' })
  @Prop({ required: true })
  texto: string;

  @ApiProperty({ example: 'Autor del comentario' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  autor: Types.ObjectId;

  @ApiProperty({ example: 'ID del post del comentario' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  postId: Types.ObjectId;

  @ApiProperty({ example: 'Indica si fue modificado' })
  @Prop({ default: false })
  modificado: boolean;
}
export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
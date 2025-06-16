import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  descripcion: string;

  @Prop() // url de la imagen (si la hay)
  imagenUrl?: string;

  @Prop({ default: true }) // para baja lógica
  activo: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  autor: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  meGusta: Types.ObjectId[];
}

export const PostSchema = SchemaFactory.createForClass(Post);

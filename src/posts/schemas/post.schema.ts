import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @ApiProperty()
  @Prop({ required: true })
  titulo: string;

  @ApiProperty()
  @Prop({ required: true })
  descripcion: string;

  @ApiProperty()
  @Prop()
  imagenUrl?: string;

  @ApiProperty()
  @Prop({ default: true })
  activo: boolean;

  @ApiProperty()
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  autor: Types.ObjectId;

  @ApiProperty()
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  meGusta: Types.ObjectId[];

  @ApiProperty()
  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @ApiProperty()
  @Prop({ default: Date.now })
  fechaActualizacion: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);

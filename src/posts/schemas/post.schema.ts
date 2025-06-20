import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document, Schema as MongooseSchema  } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @ApiProperty({example: 'Titulo del post'})
  @Prop({ required: true })
  titulo: string;

  @ApiProperty({example: 'Descripcion del post'})
  @Prop({ required: true })
  descripcion: string;

  @ApiProperty({example: 'https://ejemplo.com/imagen.jpg'})
  @Prop() // url de la imagen (si la hay)
  imagenUrl?: string;

  @ApiProperty({example: 'true'})
  @Prop({ default: true }) // para baja lógica
  activo: boolean;

  @ApiProperty({example: '5f8d0c9b9b1e8c001f8d0c9b'})
  // @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  autor: Types.ObjectId;

  @ApiProperty({example: '5f8d0c9b9b1e8c001f8d0c9c'})
  // @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: [] })
  meGusta: Types.ObjectId[];//cambiar a like

  @ApiProperty({example: '2023-10-01T12:00:00Z'})
  @Prop({ default: Date.now }) // fecha de creación
  fechaCreacion: Date;

  @ApiProperty({example: '2023-10-01T12:00:00Z'})
  @Prop({ default: Date.now }) // fecha de actualización
  fechaActualizacion: Date;

}

export const PostSchema = SchemaFactory.createForClass(Post);

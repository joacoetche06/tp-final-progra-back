// src/comments/comments.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from './schemas/comentario.schema';
import { CommentsService } from './comentarios.service';
import { CommentsController } from './comentarios.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comentario.name, schema: ComentarioSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [MongooseModule], // 👈 Esto es clave para que otros módulos lo usen
})
export class CommentsModule {}

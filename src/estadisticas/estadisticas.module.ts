import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comentarios/comentarios.module';

@Module({
  imports: [
    PostsModule, // Exporta el modelo Post
    CommentsModule, // Exporta el modelo Comentario
  ],
  providers: [EstadisticasService],
  controllers: [EstadisticasController],
})
export class EstadisticasModule {}

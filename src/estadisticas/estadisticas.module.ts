// src/estadisticas/estadisticas.module.ts
import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Post, PostSchema } from 'src/posts/schemas/post.schema';
import {
  Comentario,
  ComentarioSchema,
} from 'src/comentarios/schemas/comentario.schema';
import { UsersModule } from 'src/users/users.module';
import { CommentsModule } from 'src/comentarios/comentarios.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [
    PostsModule,
    CommentsModule,
    UsersModule,
    // Añadimos los modelos directamente aquí también
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comentario.name, schema: ComentarioSchema },
    ]),
  ],
  providers: [EstadisticasService],
  controllers: [EstadisticasController],
})
export class EstadisticasModule {}

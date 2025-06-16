import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { CreatePostDto } from './dto/create_post.dto';
import { QueryPostsDto } from './dto/query_post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async crear(postDto: CreatePostDto, autorId: string, imagenUrl?: string) {
    return this.postModel.create({
      ...postDto,
      imagenUrl,
      autor: autorId,
    });
  }

  async bajaLogica(postId: string, solicitante: any) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    // permitir si el creador es el mismo o tiene perfil admin
    if (
      post.autor.toString() !== solicitante.id &&
      solicitante.perfil !== 'admin'
    )
      throw new ForbiddenException('Acceso denegado');

    post.activo = false;
    await post.save();
    return { success: true };
  }

  async listar(query: QueryPostsDto) {
    const filtro: any = { activo: true };

    if (query.userId) {
      if (!Types.ObjectId.isValid(query.userId)) {
        throw new BadRequestException('ID de usuario inválido');
      }
      filtro.autor = new Types.ObjectId(query.userId);
    }

    return this.postModel
      .find(filtro)
      .populate('autor', 'username')
      .sort(query.sort === 'likes' ? { meGusta: -1 } : { createdAt: -1 })
      .skip(Number(query.offset ?? 0))
      .limit(Number(query.limit ?? 10))

      .exec();
  }

  async darMeGusta(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    if (post.meGusta.includes(new Types.ObjectId(userId)))
      throw new BadRequestException('Ya diste me gusta');

    post.meGusta.push(new Types.ObjectId(userId));
    await post.save();
    return { likes: post.meGusta.length };
  }

  async quitarMeGusta(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    const idx = post.meGusta.findIndex((u) => u.toString() === userId);
    if (idx === -1) throw new BadRequestException('No habías dado me gusta');

    post.meGusta.splice(idx, 1);
    await post.save();
    return { likes: post.meGusta.length };
  }
}

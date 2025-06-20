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
import { QueryPostsDto, SortBy } from './dto/query_posts.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {}

  async crear(createPostDto: CreatePostDto, autorId: string, imagenPath?: string): Promise<Post> {
    const imagenUrl = imagenPath || createPostDto.imagenUrl;

    return this.postModel.create({
      ...createPostDto,
      imagenUrl,
      autor: autorId,
      meGusta: [],
    });
  }

  async findAll(getPostsDto: QueryPostsDto): Promise<{ posts: Post[]; total: number }> {
    const { sort, userId, offset = 0, limit = 10 } = getPostsDto;
    console.log(getPostsDto);
    const query = this.postModel.find({ activo: true });

    if (userId) {
      if (!Types.ObjectId.isValid(userId)) {
        throw new NotFoundException('ID de usuario inválido');
      }
      query.where('autor').equals(userId);
    }

    if (sort === SortBy.LIKES) {
      query.sort({ 'meGusta.length': -1, fechaCreacion: -1 });
    } else {
      query.sort({ fechaCreacion: -1 });
    }

    query.skip(offset).limit(limit);
    query.populate('autor', 'nombreUsuario imagenPerfilUrl');

    const posts = await query.exec();
    const total = await this.postModel.countDocuments({
      activo: true,
      ...(userId ? { autor: userId } : {}),
    });

    return { posts, total };
  }

  async eliminar(postId: string, solicitante: any) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    const isAutor = post.autor?.toString() === solicitante.id;
    const isAdmin = solicitante.perfil === 'admin';

    if (!isAutor && !isAdmin) {
      throw new ForbiddenException('Acceso denegado');
    }

    post.activo = false;
    await post.save();

    return { success: true };
  }

  async darMeGusta(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    if (post.meGusta.some(id => id.toString() === userId)) {
      throw new BadRequestException('Ya diste me gusta');
    }

    post.meGusta.push(new Types.ObjectId(userId));
    await post.save();

    return { likes: post.meGusta.length };
  }

  async quitarMeGusta(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    const idx = post.meGusta.findIndex(id => id.toString() === userId);
    if (idx === -1) throw new BadRequestException('No habías dado me gusta');

    post.meGusta.splice(idx, 1);
    await post.save();

    return { likes: post.meGusta.length };
  }
}

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

  async crear(
    createPostDto: CreatePostDto,
    autorId: string,
    imagenPath?: string,
  ): Promise<Post> {
    const imagenUrl = imagenPath || createPostDto.imagenUrl;

    return this.postModel.create({
      ...createPostDto,
      imagenUrl,
      autor: autorId,
      meGusta: [],
    });
  }

  async findAll(dto: QueryPostsDto): Promise<{ posts: Post[]; total: number }> {
    const { sort, userId, offset = 0, limit = 10 } = dto;
    const filtro: any = { activo: true };

    if (userId) {
      if (!Types.ObjectId.isValid(userId)) {
        throw new NotFoundException('ID de usuario inválido');
      }
      filtro.autor = new Types.ObjectId(userId);
    }

    const pipeline: any[] = [
      { $match: filtro },

      // Agregamos conteo de likes si se ordena por likes
      ...(sort === SortBy.LIKES
        ? [{ $addFields: { likesCount: { $size: '$meGusta' } } }]
        : []),

      // Ordenamiento
      {
        $sort:
          sort === SortBy.LIKES
            ? { likesCount: -1, fechaCreacion: -1 }
            : { fechaCreacion: -1 },
      },

      { $skip: offset },
      { $limit: limit },

      // Unimos con autor
      {
        $lookup: {
          from: 'users',
          localField: 'autor',
          foreignField: '_id',
          as: 'autor',
        },
      },
      { $unwind: '$autor' },

      // Contar comentarios sin traerlos
      {
        $lookup: {
          from: 'comentarios',
          localField: '_id',
          foreignField: 'postId',
          as: 'comentarios',
        },
      },
      {
        $addFields: {
          comentariosCount: { $size: '$comentarios' },
        },
      },

      // Seleccionamos solo lo necesario
      {
        $project: {
          titulo: 1,
          descripcion: 1,
          imagenUrl: 1,
          activo: 1,
          createdAt: 1,
          meGusta: 1,
          comentariosCount: 1,
          'autor.nombreUsuario': 1,
          'autor.imagenPerfilUrl': 1,
        },
      },
    ];

    const posts = await this.postModel.aggregate(pipeline);
    const total = await this.postModel.countDocuments(filtro);
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

    if (post.meGusta.some((id) => id.toString() === userId)) {
      throw new BadRequestException('Ya diste me gusta');
    }

    post.meGusta.push(new Types.ObjectId(userId));
    await post.save();

    return { likes: post.meGusta.length };
  }

  async quitarMeGusta(postId: string, userId: string) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Publicación no encontrada');

    const idx = post.meGusta.findIndex((id) => id.toString() === userId);
    if (idx === -1) throw new BadRequestException('No habías dado me gusta');

    post.meGusta.splice(idx, 1);
    await post.save();

    return { likes: post.meGusta.length };
  }

  async findById(id: string) {
    return this.postModel
      .findById(id)
      .populate('autor', '-password') // opcional: para traer el autor sin la contraseña
      .lean();
  }
}

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
import { QueryPostsDto, GetPostsDto, SortBy } from './dto/query_posts.dto';

//el profe importa el authservice, lo agrego comentando para no romper todo
import { AuthService } from 'src/auth/auth.service';

@Injectable() //poder utilizar en cualquier lugar mediante inyeccion el Service
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument> , private authService: AuthService,
  ) {}

  async crear(
    createPostDto: CreatePostDto,
    autorId: string,
    imagenPath?: string,
  ): Promise<Post> {
    const imagenUrl = imagenPath || createPostDto.imagenUrl;

    /*
    const newPost = new this.postModel({
      ...createPostDto,
      imagenPath,
      autor: autorId,
      meGusta: []
    });

    return newPost.save();
    */

    return this.postModel.create({
      ...createPostDto,
      imagenPath,
      autor: autorId,
      meGusta: [],
    });
  }

  //ASI HACE EL PROFESOR
  async findAll(getPostsDto: GetPostsDto): Promise<{ posts: Post[]; total: number }> {
    const { sort, userId, offset = 0, limit = 10 } = getPostsDto;

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

    query.populate('autor', 'username imagenPerfilUrl');

    const posts = await query.exec();

    const total = await this.postModel.countDocuments({
      activo: true,
      ...(userId ? { autor: userId } : {}),
    });

    return { posts, total };
  }

  async findOne(id: string): Promise<Post>{
    if(!Types.ObjectId.isValid(id)){
        throw new NotFoundException('ID inválido');
    }

    const post = await this.postModel.findOne({
      _id: id,
      activo: true,
    }).populate('autor', 'username imagenPerfilUrl').exec();

    if(!post){
      throw new NotFoundException('Post no encontrado');
    }

    return post;
  }


  async eliminar(postId: string, solicitante: any) {
    const post = await this.postModel.findOne({postId});
    if (!post) throw new NotFoundException('Publicación no encontrada');

//ASI LO HACE EL PROFE
    /*
    const user = await this.authService.findById(usuarioId);
    const isAdmin = user && user.tipoPerfil ? user.tipoPerfil.includes('admin') : false;
    const isAutor = post.autor ? post.autor.toString() === solicitante.id : false;

    if(!isAdmin && !isAutor){
      throw new ForbiddenException('Acceso denegado');
    }

    const updatePost = await this.postModel.findByIdAndUpdate(
      postId,
      {activo: true},
      {new: true}
    )

    if(!updatePost){
      throw new NotFoundException('No se pudo encontrar la publicación para actualizar')
    }

    return updatePost;

    */


    // permitir si el creador es el mismo o tiene perfil admin
    if (post.autor.toString() !== solicitante.id &&
    solicitante.perfil !== 'admin')
      {throw new ForbiddenException('Acceso denegado');}
      

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


  //ASI HACE EL PROFESOR EL DE ME GUSTA Y SACAR ME GUSTA

/*
  async addLike(postId:string, userId: string) : Promise<Post>{
    if(!Types.ObjectId.isValid(postId)){
        throw new NotFoundException('Post ID inválido');
    }

    const post = await this.findOne(postId);
    if (post.likes && post.likes.some(like => like?.toString() === userId)){
      throw new ForbiddenException('Ya diste me gusta');
    }

    const updatePost = await this.postModel.findByIdAndUpdate(
      postId,
      {$push: {likes: userId}},
      {new:true}
    ).exec();

    if(!updatePost){
      throw new NotFoundException('No se pudo encontrar la publicacion para dar me gusta');
    }

    return updatePost;
  }

  async removeLike(postId:string, userId: string) : Promise<Post>{
    if(!Types.ObjectId.isValid(postId)){
        throw new NotFoundException('Post ID inválido');
    }

    const post = await this.findOne(postId);
    if (!post.likes || !post.likes.some(like => like?.toString() === userId)){
      throw new ForbiddenException('No le diste me gusta');
    }

    const updatePost = await this.postModel.findByIdAndUpdate(
      postId,
      {$pull: {likes: userId}},
      {new:true}
    ).exec();

    if(!updatePost){
      throw new NotFoundException('No se pudo encontrar la publicacion para sacar el me gusta');
    }

    return updatePost;
  }
    */

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

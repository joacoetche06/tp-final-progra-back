// src/estadisticas/estadisticas.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';
import {
  Comentario,
  ComentarioDocument,
} from 'src/comentarios/schemas/comentario.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema'; // Importar modelo de usuario
import { Model } from 'mongoose';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comentario.name)
    private comentarioModel: Model<ComentarioDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>, // Añade esto
  ) {}

  async getPublicacionesPorUsuario(from: string, to: string) {
    return this.postModel.aggregate([
      {
        $match: {
          fechaCreacion: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'autor',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: {
            userId: '$autor',
            username: {
              $ifNull: ['$user.nombreUsuario', 'Desconocido'],
            },
          },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          userId: '$_id.userId',
          username: '$_id.username', // Cambiado de nombreUsuario a username
          total: 1,
        },
      },
    ]);
  }

  async getComentariosPorDia(from: string, to: string) {
    return this.comentarioModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          total: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
  }

  async getComentariosPorPublicacion(from: string, to: string) {
    return this.comentarioModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(from),
            $lte: new Date(to),
          },
        },
      },
      {
        $lookup: {
          // Unir con colección de posts
          from: 'posts',
          localField: 'postId',
          foreignField: '_id',
          as: 'post',
        },
      },
      { $unwind: '$post' }, // Descomponer el array
      {
        $group: {
          _id: '$post.titulo', // Usar título en lugar de ID
          total: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
  }
}

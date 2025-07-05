// src/estadisticas/estadisticas.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from 'src/posts/schemas/post.schema';
import {
  Comentario,
  ComentarioDocument,
} from 'src/comentarios/schemas/comentario.schema';
import { Model } from 'mongoose';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comentario.name)
    private comentarioModel: Model<ComentarioDocument>,
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
        $group: {
          _id: '$autor',
          total: { $sum: 1 },
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
        $group: {
          _id: '$postId',
          total: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
  }
}

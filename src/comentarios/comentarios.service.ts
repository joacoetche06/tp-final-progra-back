import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comentario, ComentarioDocument } from './schemas/comentario.schema';
import { CreateComentarioDto } from './dto/create_comentario.dto';
import { UpdateComentarioDto } from './dto/update_comentario.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comentario.name)
    private readonly comentarioModel: Model<ComentarioDocument>,
  ) {}

  async create(postId: string, userId: string, dto: CreateComentarioDto) {
    return this.comentarioModel.create({
      texto: dto.texto,
      autor: userId,
      postId,
    });
  }

  // Agregar este método al servicio
  async getById(id: string) {
    const comentario = await this.comentarioModel.findById(id);
    if (!comentario) throw new NotFoundException('Comentario no encontrado');
    return comentario;
  }

  // Modificar el update para mantener la imagen
  async update(id: string, dto: UpdateComentarioDto) {
    const comentario = await this.getById(id);
    console.log(`Actualizando comentario con ID ${id} texto: ${dto.texto}`);
    if (dto.texto) {
      comentario.texto = dto.texto;
      comentario.modificado = true;
    }

    await comentario.save();
    return comentario;
  }

  // En comments.service.ts
  async findAll(postId: string, offset: number, limit: number) {
    const [comentarios, total] = await Promise.all([
      this.comentarioModel
        .find({ postId })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate('autor', 'nombre nombreUsuario imagenPerfilUrl')
        .lean(),

      this.comentarioModel.countDocuments({ postId }),
    ]);

    return { comentarios, total };
  }
}

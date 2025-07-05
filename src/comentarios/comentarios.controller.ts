import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentsService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create_comentario.dto';
import { UpdateComentarioDto } from './dto/update_comentario.dto';
import { ApiCreatedResponse } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('posts') // Cambia la ruta base a 'posts'
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  // Nueva ruta: GET /posts/:postId/comments
  @Get(':postId/comments')
  async findAll(
    @Param('postId') postId: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 5,
  ) {
    return this.commentsService.findAll(postId, offset, limit);
  }

  @ApiCreatedResponse({
    description: 'Comentario creado con autor populado',
    type: CreateComentarioDto,
  })
  @Post(':postId/comments') // POST /posts/:postId/comments
  async create(
    @Param('postId') postId: string,
    @Body() dto: CreateComentarioDto,
    @Req() req,
  ) {
    return this.commentsService.create(postId, req.user.id, dto);
  }

  @Put('comments/:id') // PUT /posts/comments/:id
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateComentarioDto,
    @Req() req,
  ) {
    const comentario = await this.commentsService.getById(id);
    console.log(
      `Actualizando comentario con ID ${id} por el usuario ${req.user.id}`,
    );
    if (comentario.autor.toString() !== req.user.id) {
      throw new ForbiddenException(
        'Solo el autor puede modificar el comentario',
      );
    }
    console.log(`DTO: ${dto.texto}`);
    return this.commentsService.update(id, dto);
  }
}

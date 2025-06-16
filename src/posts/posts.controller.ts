import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create_post.dto';
import { QueryPostsDto } from './dto/query_post.dto';

import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ---------- Crear publicación ----------
  @Post()
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          cb(null, `${Date.now()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async create(
    @UploadedFile() imagen: Express.Multer.File,
    @Body() dto: CreatePostDto,
    @Req() req,
  ) {
    const imagenUrl = imagen ? `/uploads/${imagen.filename}` : undefined;
    return this.postsService.crear(dto, req.user.id, imagenUrl);
  }

  // ---------- Baja lógica ----------
  @Delete(':id')
  async softDelete(@Param('id') id: string, @Req() req) {
    return this.postsService.bajaLogica(id, req.user);
  }

  // ---------- Listado + filtros ----------
  @Get()
  async list(@Query() q: QueryPostsDto) {
    return this.postsService.listar(q);
  }

  // ---------- Dar me gusta ----------
  @Post(':id/like')
  async like(@Param('id') id: string, @Req() req) {
    return this.postsService.darMeGusta(id, req.user.id);
  }

  // ---------- Quitar me gusta ----------
  @Delete(':id/like')
  async unlike(@Param('id') id: string, @Req() req) {
    return this.postsService.quitarMeGusta(id, req.user.id);
  }
}

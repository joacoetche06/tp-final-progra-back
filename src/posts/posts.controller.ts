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
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create_post.dto';
import { QueryPostsDto } from './dto/query_posts.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Post as PostEntity } from './schemas/post.schema';

@ApiTags('Publicaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
  @ApiCreatedResponse({
    description: 'Post creado correctamente',
    type: PostEntity,
  })
  async create(
    @UploadedFile() imagen: Express.Multer.File,
    @Body() dto: CreatePostDto,
    @Req() req,
  ) {
    const imagenPath = imagen ? `/uploads/${imagen.filename}` : undefined;
    return this.postsService.crear(dto, req.user.id, imagenPath);
  }

  @Get()
  @ApiOkResponse({ description: 'Lista de publicaciones', type: [PostEntity] })
  async list(@Req() req, @Query() dto: QueryPostsDto) {
    return this.postsService.findAll(dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Post eliminado correctamente' })
  async softDelete(@Param('id') id: string, @Req() req) {
    return this.postsService.eliminar(id, req.user);
  }

  @Post(':id/like')
  @ApiOkResponse({ description: 'Me gusta agregado' })
  async like(@Param('id') id: string, @Req() req) {
    return this.postsService.darMeGusta(id, req.user.id);
  }

  @Delete(':id/like')
  @ApiOkResponse({ description: 'Me gusta quitado' })
  async unlike(@Param('id') id: string, @Req() req) {
    return this.postsService.quitarMeGusta(id, req.user.id);
  }
}

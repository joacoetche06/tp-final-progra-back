import {
  IsOptional,
  IsIn,
  IsNumberString,
  IsMongoId,
  IsString,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

//como hizo profe en get-posts.dto.ts

export enum SortBy {
  DATE = 'date',
  LIKES = 'likes',
}

export class GetPostsDto {
  @ApiPropertyOptional({
    enum: SortBy,
    default: SortBy.DATE,
    description: 'Ordenamiento por fecha o likes',
  })
  @IsOptional({ message: 'El ordenamiento es opcional' })
  @IsString({ message: 'El ordenamiento debe ser una cadena de texto' })
  @IsEnum(SortBy)
  sort?: SortBy = SortBy.DATE;

  @ApiPropertyOptional({ description: 'Filtrar por ID de usuario' })
  @IsString({ message: 'El ID de usuario debe ser una cadena de texto' })
  @IsOptional({ message: 'El ID de usuario es opcional' })
  userId?: string;

  @ApiPropertyOptional({ description: 'Offset para paginacion', default: 0 })
  @Type(() => Number)
  @IsOptional({ message: 'El offset es opcional' })
  @IsNumber({}, { message: 'El offset debe ser un numero' })
  @Min(0, { message: 'El offset debe ser mayor o igual a 0' })
  offset?: number = 0;

  @ApiPropertyOptional({ description: 'Limit para paginacion', default: 10 })
  @Type(() => Number)
  @IsOptional()
  @IsNumber({}, { message: 'El limit debe ser un numero' })
  @Min(1, { message: 'El limit debe ser mayor o igual a 1' })
  limit?: number = 10;
}

//como habia hecho yo

export class QueryPostsDto {
  @ApiPropertyOptional({ example: 'fecha' })
  @IsOptional()
  @IsIn(['fecha', 'likes'])
  sort?: 'fecha' | 'likes';

  @ApiPropertyOptional({ example: '0' })
  @IsOptional()
  @IsNumberString()
  offset?: string;

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsNumberString()
  limit?: string;

  @ApiPropertyOptional({ example: '5f8d0c9b9b1e8c001f8d0c9b' })
  @IsOptional()
  @IsMongoId()
  userId?: string;
}

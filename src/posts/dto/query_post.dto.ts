import { IsOptional, IsIn, IsNumberString, IsMongoId } from 'class-validator';

export class QueryPostsDto {
  @IsOptional()
  @IsIn(['fecha', 'likes'])
  sort?: 'fecha' | 'likes';

  @IsOptional()
  @IsNumberString()
  offset?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsMongoId()
  userId?: string;
}

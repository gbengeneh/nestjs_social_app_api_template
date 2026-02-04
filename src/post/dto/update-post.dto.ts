// src/post/dto/update-post.dto.ts
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
// Define MediaType enum locally or import it from the correct source
enum MediaType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(MediaType)
  mediaType?: MediaType;

  @IsOptional()
  @IsUrl()
  mediaUrl?: string;

  @IsOptional()
  @IsString()
  communityId?: string;
}

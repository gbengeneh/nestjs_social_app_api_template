// src/comment/dto/update-comment.dto.ts
import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  content: string;
}

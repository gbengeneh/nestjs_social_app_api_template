// src/group/dto/update-group.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateGroupDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
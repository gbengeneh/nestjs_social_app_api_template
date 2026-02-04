// src/like/like.controller.ts
import { Controller, Post, Param, UseGuards, Req, Get } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('likes')

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // Toggle like on a post (add or remove)
  @UseGuards(JwtGuard)
  @Post(':postId')
  toggleLike(@Param('postId') postId: string, @Req() req) {
    return this.likeService.toggleLike(req.user.sub, postId);
  }

  // Get like count for a post
  @Get('count/:postId')
  count(@Param('postId') postId: string) {
    return this.likeService.countLikes(postId);
  }
}

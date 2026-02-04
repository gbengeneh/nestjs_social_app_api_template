// src/like/like.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  // Toggle like on a post (add or remove)
  async toggleLike(userId: string, postId: string) {
    const existingLike = await this.prisma.like.findFirst({
      where: { userId, postId },
    });

    // If the user has already liked the post, remove the like
    if (existingLike) {
      return this.prisma.like.delete({
        where: { id: existingLike.id },
      });
    }

    // If the user hasn't liked the post, add a new like
    return this.prisma.like.create({
      data: {
        postId,
        userId,
      },
    });
  }

  // Get the number of likes on a post
  async countLikes(postId: string) {
    return this.prisma.like.count({
      where: { postId },
    });
  }
}

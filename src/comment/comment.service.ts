// src/comment/comment.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  // Create a comment
  async create(userId: string, postId: string, dto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: {
        content: dto.content,
        userId,
        postId,
      },
    });
  }

  // Find all comments for a post
  async findAll(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Update a comment
  async update(userId: string, id: string, dto: UpdateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.userId !== userId) {
      throw new Error('Unauthorized or comment not found');
    }

    return this.prisma.comment.update({
      where: { id },
      data: {
        content: dto.content,
      },
    });
  }

  // Delete a comment
  async remove(userId: string, id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.userId !== userId) {
      throw new Error('Unauthorized or comment not found');
    }
    return this.prisma.comment.delete({ where: { id } });
  }
}

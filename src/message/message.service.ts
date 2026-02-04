import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
export type MessageStatus = 'SENT' | 'DELIVERED' | 'READ'; // Define MessageStatus manually

export type MediaType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'TEXT'; // Define MediaType manually if not exported

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(dto: CreateMessageDto, userId: string) {
    return this.prisma.message.create({
      data: {
        conversationId: dto.conversationId,
        content: dto.content,
        mediaUrl: dto.mediaUrl,
        mediaType: dto.mediaType as MediaType | null,
        userId,
      },
    });
  }

  async getAllMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: { conversationId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateStatus(messageId: string, status: string) {
    return this.prisma.message.update({
      where: { id: messageId },
      data: { status: status as MessageStatus },
    });
  }

  async getMessages(conversationId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return this.prisma.message.findMany({
      where: { conversationId },
      include: { user: true },
      orderBy: { createdAt: 'desc' }, // newest first
      skip,
      take: limit,
    });
  }
  
}

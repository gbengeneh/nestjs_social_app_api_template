import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateConversationDto) {
    return this.prisma.conversation.create({
      data: {
        type: dto.type,
      },
    });
  }

  async findAll() {
    return this.prisma.conversation.findMany({
      include: { messages: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.conversation.findUnique({
      where: { id },
      include: { messages: true },
    });
  }
}

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Post()
  create(@Body() dto: CreateConversationDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}

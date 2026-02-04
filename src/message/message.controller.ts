import { Controller, Post, Body, Param, Get, Patch, Req, UseGuards, Query } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @UseGuards(JwtGuard)
  @Post()
  sendMessage(@Body() dto: CreateMessageDto, @Req() req) {
    return this.service.sendMessage(dto, req.user.sub);
  }

  // Removed duplicate getMessages method to resolve the error.

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
    return this.service.updateStatus(id, dto.status);
  }

  @Get('conversation/:id')
getMessages(
  @Param('id') conversationId: string,
  @Query('page') page = '1',
  @Query('limit') limit = '20',
) {
  return this.service.getMessages(conversationId, parseInt(page), parseInt(limit));
}

}

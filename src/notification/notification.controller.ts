import { Controller, Post, Body, Get, Patch, Param, Query, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @UseGuards(JwtGuard)
  @Post()
  createNotification(@Body() dto: CreateNotificationDto, @Req() req) {
    return this.service.createNotification(dto, req.user.sub);
  }

  @UseGuards(JwtGuard)
  @Get()
  getNotifications(
    @Req() req,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.service.getNotifications(req.user.sub, parseInt(page), parseInt(limit));
  }

  @UseGuards(JwtGuard)
  @Patch(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.service.markAsRead(id);
  }
}

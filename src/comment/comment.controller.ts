// src/comment/comment.controller.ts
import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    Delete,
    Put,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { CommentService } from './comment.service';
  import { CreateCommentDto } from './dto/create-comment.dto';
  import { UpdateCommentDto } from './dto/update-comment.dto';
  import { JwtGuard } from '../auth/guards/jwt.guard';
  import { ApiTags } from '@nestjs/swagger';
  
  @ApiTags('comments')
  @Controller('comments')
  export class CommentController {
    constructor(private readonly commentService: CommentService) {}
  
    // Create a comment for a post
    @UseGuards(JwtGuard)
    @Post(':postId')
    create(
      @Param('postId') postId: string,
      @Body() dto: CreateCommentDto,
      @Req() req,
    ) {
      return this.commentService.create(req.user.sub, postId, dto);
    }
  
    // Get all comments for a post
    @Get(':postId')
    findAll(@Param('postId') postId: string) {
      return this.commentService.findAll(postId);
    }
  
    // Update a comment
    @UseGuards(JwtGuard)
    @Put(':id')
    update(
      @Param('id') id: string,
      @Body() dto: UpdateCommentDto,
      @Req() req,
    ) {
      return this.commentService.update(req.user.sub, id, dto);
    }
  
    // Delete a comment
    @UseGuards(JwtGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
      return this.commentService.remove(req.user.sub, id);
    }
  }
  
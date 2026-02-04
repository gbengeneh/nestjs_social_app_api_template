import {
    Controller,
    Get,
    Post,
    Param,
    Body,
    Delete,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
    UploadedFile,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { PostService } from './post.service';
  import { CreatePostDto } from './dto/create-post.dto';
  import { UpdatePostDto } from './dto/update-post.dto';
  import { JwtGuard } from '../auth/guards/jwt.guard';
  import { ApiTags } from '@nestjs/swagger';
  
  @ApiTags('posts')
  @Controller('posts')
  export class PostController {
    constructor(private readonly postService: PostService) {}
  
    // Create a post
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post()
    create(@Body() dto: CreatePostDto, @Req() req, @UploadedFile() file?: Express.Multer.File) {
      return this.postService.create(req.user.sub, dto, file);
    }
  
    // Get all posts for a user
    @Get('user/:userId')
    findAll(@Param('userId') userId: string) {
      return this.postService.findAll(userId);
    }
  
    // Get a post by ID
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.postService.findOne(id);
    }
  
    // Update a post
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Put(':id')
    update(
      @Param('id') id: string,
      @Body() dto: UpdatePostDto,
      @Req() req,
      @UploadedFile() file?: Express.Multer.File,
    ) {
      return this.postService.update(req.user.sub, id, dto, file);
    }
  
    // Delete a post
    @UseGuards(JwtGuard)
    @Delete(':id')
    remove(@Param('id') id: string, @Req() req) {
      return this.postService.remove(req.user.sub, id);
    }
  }

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { PostResponseDto } from './dto/post-response.dto';

@Injectable()
export class PostService {
  private readonly baseUrl: string;

  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService,
  ) {
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  }

  // Create a new post
  async create(userId: string, dto: CreatePostDto, file?: Express.Multer.File) {
    // Validate community existence
    const community = await this.prisma.community.findUnique({
      where: { id: dto.communityId },
    });
    if (!community) {
      throw new Error('Community not found');
    }

    let mediaUrl = dto.mediaUrl;
    let mediaType = dto.mediaType;

    if (file) {
      const mimeType = file.mimetype;
      if (mimeType.startsWith('image/')) {
        mediaUrl = await this.fileUploadService.compressImageAndUpload(file.buffer, userId, file.originalname);
        mediaType = mimeType as any;
      } else if (mimeType.startsWith('audio/')) {
        mediaUrl = await this.fileUploadService.compressAudioBufferAndUpload(file.buffer, userId, file.originalname);
        mediaType = mimeType as any;
      } else if (mimeType.startsWith('video/')) {
        mediaUrl = await this.fileUploadService.compressVideoBufferAndUpload(file.buffer, userId, file.originalname);
        mediaType = mimeType as any;
      } else {
        // For other file types, fallback to direct upload with mime detection
        mediaUrl = await this.fileUploadService.uploadFileDirectly(file.buffer, userId, file.originalname);
        mediaType = mimeType as any;
      }
    }

    const post = await this.prisma.post.create({
      data: {
        content: dto.content,
        mediaType,
        mediaUrl,
        userId,
        communityId: dto.communityId,
      },
    });

    return PostResponseDto.fromEntity(post);
  }

  // Find all posts by a user
  async findAll(userId: string) {
    const posts = await this.prisma.post.findMany({
      where: { userId },
      include: {
        user: { select: { id: true, name: true } },
        comments: true,
        likes: true,
      },
    });
    return posts.map(post => PostResponseDto.fromEntity(post));
  }

  // Find a post by ID
  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true } },
        comments: true,
        likes: true,
      },
    });
    if (!post) return null;
    return PostResponseDto.fromEntity(post);
  }

  // Update a post
  async update(userId: string, postId: string, dto: UpdatePostDto, file?: Express.Multer.File) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.userId !== userId) {
      throw new Error('Unauthorized or post not found');
    }

    let mediaUrl = dto.mediaUrl ?? post.mediaUrl;
    let mediaType = dto.mediaType ?? post.mediaType;

    if (file) {
      const mimeType = file.mimetype;
      if (mimeType.startsWith('image/')) {
        mediaUrl = await this.fileUploadService.compressImageAndUpload(file.buffer, userId, file.originalname);
        mediaType = mimeType as any;
      } else if (mimeType.startsWith('audio/')) {
        mediaUrl = await this.fileUploadService.compressAudioBufferAndUpload(file.buffer, userId, file.originalname);
        mediaType = mimeType as any;
      } else if (mimeType.startsWith('video/')) {
        mediaUrl = await this.fileUploadService.compressVideoBufferAndUpload(file.buffer, userId, file.originalname);
        mediaType = mimeType as any;
      } else {
        // For other file types, fallback to direct upload with mime detection
        mediaUrl = await this.fileUploadService.uploadFileDirectly(file.buffer, userId, file.originalname);
        mediaType = mimeType as any;
      }
    }

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        content: dto.content ?? post.content,
        mediaType,
        mediaUrl,
      },
    });

    return PostResponseDto.fromEntity(updatedPost);
  }

  // Delete a post
  async remove(userId: string, postId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post || post.userId !== userId) {
      throw new Error('Unauthorized or post not found');
    }
    const deletedPost = await this.prisma.post.delete({ where: { id: postId } });
    return PostResponseDto.fromEntity(deletedPost);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../prisma/prisma.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { CreatePostDto } from './dto/create-post.dto';

describe('PostService', () => {
  let service: PostService;
  let prismaService: PrismaService;
  let fileUploadService: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: {
            community: {
              findUnique: jest.fn(),
            },
            post: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: FileUploadService,
          useValue: {
            compressImageAndUpload: jest.fn(),
            compressAudioBufferAndUpload: jest.fn(),
            compressVideoBufferAndUpload: jest.fn(),
            uploadFileDirectly: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prismaService = module.get<PrismaService>(PrismaService);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
  });

  describe('create', () => {
    it('should throw error if community not found', async () => {
      jest.spyOn(prismaService.community, 'findUnique').mockResolvedValue(null);
      await expect(service.create('user1', { communityId: 'comm1', content: 'test' } as CreatePostDto)).rejects.toThrow('Community not found');
    });

    it('should upload image file and create post', async () => {
      jest.spyOn(prismaService.community, 'findUnique').mockResolvedValue({
        id: 'comm1',
        name: 'Community 1',
        description: null,
        createdAt: new Date(),
        imageUrl: null,
      });
      jest.spyOn(fileUploadService, 'compressImageAndUpload').mockResolvedValue('http://image.url');
      jest.spyOn(prismaService.post, 'create').mockResolvedValue({
        id: 'post1',
        content: 'test',
        mediaUrl: 'http://image.url',
        mediaType: 'image/jpeg' as any,
        userId: 'user1',
        communityId: 'comm1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const file = {
        buffer: Buffer.from(''),
        mimetype: 'image/jpeg',
        originalname: 'test.jpg',
      } as Express.Multer.File;

      const dto = { communityId: 'comm1', content: 'test' } as CreatePostDto;

      const result = await service.create('user1', dto, file);
      expect(result.mediaUrl).toBe('http://image.url');
      expect(fileUploadService.compressImageAndUpload).toHaveBeenCalled();
      expect(prismaService.post.create).toHaveBeenCalled();
    });

    it('should upload audio file and create post', async () => {
      jest.spyOn(prismaService.community, 'findUnique').mockResolvedValue({
        id: 'comm1',
        name: 'Community 1',
        description: null,
        createdAt: new Date(),
        imageUrl: null,
      });
      jest.spyOn(fileUploadService, 'compressAudioBufferAndUpload').mockResolvedValue('http://audio.url');
      jest.spyOn(prismaService.post, 'create').mockResolvedValue({
        id: 'post2',
        content: 'test audio',
        mediaUrl: 'http://audio.url',
        mediaType: 'audio/mpeg' as any,
        userId: 'user1',
        communityId: 'comm1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const file = {
        buffer: Buffer.from(''),
        mimetype: 'audio/mpeg',
        originalname: 'test.mp3',
      } as Express.Multer.File;

      const dto = { communityId: 'comm1', content: 'test audio' } as CreatePostDto;

      const result = await service.create('user1', dto, file);
      expect(result.mediaUrl).toBe('http://audio.url');
      expect(fileUploadService.compressAudioBufferAndUpload).toHaveBeenCalled();
      expect(prismaService.post.create).toHaveBeenCalled();
    });

    it('should upload video file and create post', async () => {
      jest.spyOn(prismaService.community, 'findUnique').mockResolvedValue({
        id: 'comm1',
        name: 'Community 1',
        description: null,
        createdAt: new Date(),
        imageUrl: null,
      });
      jest.spyOn(fileUploadService, 'compressVideoBufferAndUpload').mockResolvedValue('http://video.url');
      jest.spyOn(prismaService.post, 'create').mockResolvedValue({
        id: 'post3',
        content: 'test video',
        mediaUrl: 'http://video.url',
        mediaType: 'video/mp4' as any,
        userId: 'user1',
        communityId: 'comm1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const file = {
        buffer: Buffer.from(''),
        mimetype: 'video/mp4',
        originalname: 'test.mp4',
      } as Express.Multer.File;

      const dto = { communityId: 'comm1', content: 'test video' } as CreatePostDto;

      const result = await service.create('user1', dto, file);
      expect(result.mediaUrl).toBe('http://video.url');
      expect(fileUploadService.compressVideoBufferAndUpload).toHaveBeenCalled();
      expect(prismaService.post.create).toHaveBeenCalled();
    });

    it('should upload other file types directly and create post', async () => {
      jest.spyOn(prismaService.community, 'findUnique').mockResolvedValue({
        id: 'comm1',
        name: 'Community 1',
        description: null,
        createdAt: new Date(),
        imageUrl: null,
      });
      jest.spyOn(fileUploadService, 'uploadFileDirectly').mockResolvedValue('http://file.url');
      jest.spyOn(prismaService.post, 'create').mockResolvedValue({
        id: 'post4',
        content: 'test file',
        mediaUrl: 'http://file.url',
        mediaType: 'application/pdf' as any,
        userId: 'user1',
        communityId: 'comm1',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const file = {
        buffer: Buffer.from(''),
        mimetype: 'application/pdf',
        originalname: 'test.pdf',
      } as Express.Multer.File;

      const dto = { communityId: 'comm1', content: 'test file' } as CreatePostDto;

      const result = await service.create('user1', dto, file);
      expect(result.mediaUrl).toBe('http://file.url');
      expect(fileUploadService.uploadFileDirectly).toHaveBeenCalled();
      expect(prismaService.post.create).toHaveBeenCalled();
    });
  });
});

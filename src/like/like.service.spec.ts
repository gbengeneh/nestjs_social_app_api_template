import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './like.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('LikeService', () => {
  let service: LikeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [LikeService],
    }).compile();

    service = module.get<LikeService>(LikeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

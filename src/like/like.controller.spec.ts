import { Test, TestingModule } from '@nestjs/testing';
import { LikeController } from './like.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LikeService } from './like.service';

describe('LikeController', () => {
  let controller: LikeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [LikeController],
      providers: [LikeService],
    }).compile();

    controller = module.get<LikeController>(LikeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

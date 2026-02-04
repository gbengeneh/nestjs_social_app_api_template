import { Test, TestingModule } from '@nestjs/testing';
import { CommunityController } from './community.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommunityService } from './community.service';

describe('CommunityController', () => {
  let controller: CommunityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [CommunityController],
      providers: [CommunityService],
    }).compile();

    controller = module.get<CommunityController>(CommunityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

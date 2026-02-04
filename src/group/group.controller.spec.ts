import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from './group.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { GroupService } from './group.service';

describe('GroupController', () => {
  let controller: GroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [GroupController],
      providers: [GroupService],
    }).compile();

    controller = module.get<GroupController>(GroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

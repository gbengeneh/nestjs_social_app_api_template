import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MessageService } from './message.service';

describe('MessageController', () => {
  let controller: MessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [MessageController],
      providers: [MessageService],
    }).compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

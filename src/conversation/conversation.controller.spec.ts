import { Test, TestingModule } from '@nestjs/testing';
import { ConversationController } from './conversation.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConversationService } from './conversation.service';

describe('ConversationController', () => {
  let controller: ConversationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ConversationController],
      providers: [ConversationService],
    }).compile();

    controller = module.get<ConversationController>(ConversationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

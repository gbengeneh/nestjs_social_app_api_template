import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuard } from './admin.guard';
import { PrismaService } from '../../prisma/prisma.service';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminGuard,
        {
          provide: PrismaService,
          useValue: {
            groupMember: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access if user is admin of the group', async () => {
    (prismaService.groupMember.findFirst as jest.Mock).mockResolvedValue({ id: 1 });
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { sub: 'user1' },
          params: { groupId: 'group1' },
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('should deny access if user is not admin of the group', async () => {
    (prismaService.groupMember.findFirst as jest.Mock).mockResolvedValue(null);
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { sub: 'user2' },
          params: { groupId: 'group2' },
        }),
      }),
    } as unknown as ExecutionContext;

    const result = await guard.canActivate(context);
    expect(result).toBe(false);
  });
});

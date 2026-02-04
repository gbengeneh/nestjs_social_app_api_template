// src/group/group.module.ts
import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Import PrismaModule for accessing the DB

@Module({
  imports: [PrismaModule],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}

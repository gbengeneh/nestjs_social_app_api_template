// src/auth/guards/admin.guard.ts
import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub; // Get the current user from the request (JWT payload)
    const groupId = request.params.groupId; // Get the group ID from the route parameters

    // Check if the user is an admin for the group
    const groupMember = await this.prisma.groupMember.findFirst({
      where: {
        userId: userId,
        groupId: groupId,
        role: 'admin',
      },
    });

    return groupMember !== null;
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { CommunityResponseDto } from './dto/community-response.dto';

@Injectable()
export class CommunityService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCommunityDto, userId: string) {
    return this.prisma.community.create({
      data: {
        name: dto.name,
        description: dto.description,
        members: {
          create: {
            userId,
            role: 'admin', // creator becomes admin
          },
        },
      },
    });
  }

  async addUserToCommunitiesByIds(userId: string, communityIds: string[]) {
    for (const communityId of communityIds) {
      await this.addMember(communityId, userId);
    }
  }

  async addUserToCommunitiesByName(userId: string, communityNames: string[]) {
    for (const name of communityNames) {
      const community = await this.prisma.community.findFirst({
        where: { name },
      });
      if (community) {
        await this.addMember(community.id, userId);
      }
    }
  }

  async findAll() {
    const communities = await this.prisma.community.findMany({
      include: { members: true },
    });
    return communities.map(community => CommunityResponseDto.fromEntity(community));
  }

  async findOne(id: string) {
    const community = await this.prisma.community.findUnique({
      where: { id },
      include: { members: true },
    });
    if (!community) return null;
    return CommunityResponseDto.fromEntity(community);
  }

  async update(id: string, dto: UpdateCommunityDto) {
    return this.prisma.community.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.community.delete({
      where: { id },
    });
  }

  async addMember(communityId: string, userId: string, role = 'member') {
    return this.prisma.communityMember.create({
      data: {
        communityId,
        userId,
        role,
      },
    });
  }

  async removeMember(communityId: string, userId: string) {
    return this.prisma.communityMember.deleteMany({
      where: {
        communityId,
        userId,
      },
    });
  }

  async updateMemberRole(communityId: string, userId: string, role: string) {
    return this.prisma.communityMember.updateMany({
      where: {
        communityId,
        userId,
      },
      data: { role },
    });
  }
}

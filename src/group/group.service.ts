// src/group/group.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  // Create a new group
  async create(createGroupDto: CreateGroupDto, userId: string) {
    const group = await this.prisma.group.create({
      data: {
        name: createGroupDto.name,
        description: createGroupDto.description,
        members: {
          create: {
            userId: userId, // Adding the user as the first member
            role: 'admin',  // The user creating the group becomes the admin
          },
        },
      },
    });
    return group;
  }

  // Add a member to a group
  async addMember(groupId: string, userId: string, role: string = 'member') {
    const existingMember = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    if (existingMember) {
      throw new Error('User is already a member of the group');
    }

    return this.prisma.groupMember.create({
      data: {
        groupId,
        userId,
        role, // Role could be passed as a parameter (default to 'member')
      },
    });
  }

  // Remove a member from a group
  async removeMember(groupId: string, userId: string) {
    const existingMember = await this.prisma.groupMember.findFirst({
      where: {
        groupId,
        userId,
      },
    });

    if (!existingMember) {
      throw new Error('User is not a member of the group');
    }

    return this.prisma.groupMember.delete({
      where: {
        id: existingMember.id, // Deleting the member by their record's ID
      },
    });
  }

  // Update role for a member
async updateRole(groupId: string, userId: string, newRole: string) {
    const member = await this.prisma.groupMember.findFirst({
      where: { groupId, userId },
    });
  
    if (!member) {
      throw new Error('User is not a member of the group');
    }
  
    return this.prisma.groupMember.update({
      where: { id: member.id },
      data: { role: newRole },
    });
  }
  
  // Get all groups
  async findAll() {
    return this.prisma.group.findMany();
  }

  // Get group by ID
  async findOne(id: string) {
    return this.prisma.group.findUnique({
      where: { id },
    });
  }

  // Update a group
  async update(id: string, updateGroupDto: UpdateGroupDto) {
    return this.prisma.group.update({
      where: { id },
      data: {
        name: updateGroupDto.name,
        description: updateGroupDto.description,
      },
    });
  }

  // Delete a group
  async remove(id: string) {
    return this.prisma.group.delete({
      where: { id },
    });
  }
}

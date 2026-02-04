import { Controller, Post, Body, Get, Param, Patch, Delete, Req, UseGuards } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CreateCommunityDto } from './dto/create-community.dto';
import { UpdateCommunityDto } from './dto/update-community.dto';
import { AddMemberDto } from './dto/add-member.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { AddUserToCommunitiesDto } from './dto/add-user-to-communities.dto';
import { AddUserToCommunitiesByIdsDto } from './dto/add-user-to-communities-by-ids.dto';

@ApiTags('communities')
@Controller('communities')
export class CommunityController {
  constructor(private readonly service: CommunityService) {}

  @UseGuards(JwtGuard)
  @Post()
  create(@Body() dto: CreateCommunityDto, @Req() req) {
    return this.service.create(dto, req.user.sub);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCommunityDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/members')
  addMember(@Param('id') communityId: string, @Body() dto: AddMemberDto, @Req() req) {
    return this.service.addMember(communityId, req.user.sub, dto.role);
  }

  @UseGuards(JwtGuard)
  @Delete(':id/members/:userId')
  removeMember(@Param('id') communityId: string, @Param('userId') userId: string) {
    return this.service.removeMember(communityId, userId);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/members/:userId/role')
  updateRole(
    @Param('id') communityId: string,
    @Param('userId') userId: string,
    @Body('role') role: string
  ) {
    return this.service.updateMemberRole(communityId, userId, role);
  }

  @UseGuards(JwtGuard)
  @Post('add-user-to-communities')
  addUserToCommunities(@Body() dto: AddUserToCommunitiesDto) {
    return this.service.addUserToCommunitiesByName(dto.userId, dto.communityNames);
  }
}

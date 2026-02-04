import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Request, UploadedFiles, Put } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/guards/jwt.guard';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  @UseGuards(JwtGuard)
  getMe(@Request() req) {
    return this.userService.findOne(req.user.sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseInterceptors(
  FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'banner_image', maxCount: 1 },
  ])
)
 @Put(':id')
async updateUser(
  @Param('id') id: string,
  @Body() data: UpdateUserDto,
  @UploadedFiles() files: { avatar?: Express.Multer.File[]; banner_image?: Express.Multer.File[] },
) {
  const fileArray: Express.Multer.File[] = [];

  if (files.avatar?.[0]) fileArray.push({ ...files.avatar[0], fieldname: 'avatar' });
  if (files.banner_image?.[0]) fileArray.push({ ...files.banner_image[0], fieldname: 'banner_image' });

  return this.userService.update(id, data, fileArray);
}

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}


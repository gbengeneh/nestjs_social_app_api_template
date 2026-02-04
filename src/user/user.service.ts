import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileUploadService } from '../file-upload/file-upload.service';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private fileUploadService: FileUploadService,
  ) {}

  create(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(user => UserResponseDto.fromEntity(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return UserResponseDto.fromEntity(user);
  }

  async update(id: string, data: UpdateUserDto, files?: Express.Multer.File[]) {
    const updateData: any = { ...data };

    if (files && files.length > 0) {
      for (const file of files) {
        const fileName = `${Date.now()}_${file.originalname}`;
        const mime = file.mimetype;

        let fileUrl: string;

        if (mime.startsWith('image/')) {
          fileUrl = await this.fileUploadService.compressImageAndUpload(file.buffer, id, fileName);
        } else if (mime.startsWith('audio/')) {
          fileUrl = await this.fileUploadService.compressAudioBufferAndUpload(file.buffer, id, fileName);
        } else if (mime.startsWith('video/')) {
          fileUrl = await this.fileUploadService.compressVideoBufferAndUpload(file.buffer, id, fileName);
        } else {
          continue;
        }

        if (file.fieldname === 'avatar') {
          updateData.avatar = fileUrl;
        } else if (file.fieldname === 'banner_image') {
          updateData.banner_image = fileUrl;
        }
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return UserResponseDto.fromEntity(updatedUser);
  }

  async remove(id: string) {
    const deletedUser = await this.prisma.user.delete({ where: { id } });
    return UserResponseDto.fromEntity(deletedUser);
  }
}

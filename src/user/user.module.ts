import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [FileUploadModule, AuthModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

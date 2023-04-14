import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserSchema } from './models/user.model';
import { MongooseModule } from '@nestjs/mongoose';
import { USER } from 'src/utils/constants';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: USER, schema: UserSchema }]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

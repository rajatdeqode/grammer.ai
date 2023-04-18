import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Model, Types } from 'mongoose';
import { UserDocument } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { USER } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    @InjectModel(USER) private readonly userModel: Model<UserDocument>
  ) {}

  async findUserByEmail(email) {
    const user = await this.userModel.findOne({ email });

    return user;
  }
  async registerUser(user): Promise<{
    name: string;
    email: string;
    writingFor: string;
    _id: Types.ObjectId;
  }> {
    const { name, email, password, writingFor } = user;

    const hash = await this.authService.hashPassword(password);

    const registerUser = await this.userModel.create({
      name,
      email,
      password: hash,
      writingFor,
    });

    return JSON.parse(JSON.stringify(registerUser));
  }
  async registerUserGoogle(user) {
    const { name, email } = user;
    const registerUser = await this.userModel.findOneAndUpdate(
      { email },
      { name, email },
      { upsert: true }
    );

    const accessToken = await this.authService.generateAccessToken(
      registerUser
    );

    const refreshToken = await this.authService.generateRefreshToken(
      registerUser
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}

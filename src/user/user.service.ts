import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Model } from 'mongoose';
import { UserDocument } from './models/user.model';
import { InjectModel } from '@nestjs/mongoose';
import { of } from 'await-of';
import { USER } from 'src/utils/constants';

@Injectable()
export class UserService {
  constructor(
    private authService: AuthService,
    @InjectModel(USER) private readonly userModel: Model<UserDocument>
  ) {}

  async findUserByEmail(email) {
    const [user, findUserError] = await of(this.userModel.findOne({ email }));

    if (findUserError) {
      throw new BadRequestException(` ${findUserError.message}`);
    }

    return user;
  }
  async registerUser(user) {
    const { name, email, password, writingFor } = user;

    const [hash, hashPasswordError] = await of(
      this.authService.hashPassword(password)
    );

    if (hashPasswordError) {
      throw new BadRequestException(` ${hashPasswordError.message}`);
    }

    const [registerUser, createUserError] = await of(
      this.userModel.create({
        name,
        email,
        password: hash,
        writingFor,
      })
    );

    if (createUserError) {
      throw new BadRequestException(` ${createUserError.message}`);
    }
    return {
      name: registerUser.name,
      email: registerUser.email,
      writingFor: registerUser.writingFor,
    };
  }
}

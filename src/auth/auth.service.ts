import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password): Promise<string> {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    return hashPassword;
  }

  async comparePassword(password, dbPassword): Promise<boolean> {
    const validPassword = await bcrypt.compare(password, dbPassword);

    return validPassword;
  }

  async generateAccessToken(user): Promise<string> {
    const payload = { id: user._id, name: user.name, email: user.email };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    });

    return accessToken;
  }

  async generateRefreshToken(user): Promise<string> {
    const payload = { id: user._id, name: user.name, email: user.email };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
    });
    return refreshToken;
  }

  async verifyAccessToken(token): Promise<any> {
    const user = await this.jwtService.verify(token, {
      secret: process.env.ACCESS_TOKEN_SECRET,
    });
    console.log(user);
    return user;
  }
  async verifyRefreshToken(token) {
    const user = await this.jwtService.verify(token, {
      secret: process.env.REFRESH_TOKEN_SECRET,
    });
    return user;
  }
}

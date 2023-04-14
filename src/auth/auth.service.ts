import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { of } from 'await-of';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hashPassword(password) {
    const saltRounds = 10;
    const [hashPassword, hashPasswordError] = await of(
      bcrypt.hash(password, saltRounds)
    );
    if (hashPasswordError) {
      throw new BadRequestException(` ${hashPasswordError.message}`);
    }
    return hashPassword;
  }

  async comparePassword(password, dbPassword) {
    const [validPassword, passwordCompareError] = await of(
      bcrypt.compare(password, dbPassword)
    );
    if (passwordCompareError) {
      throw new BadRequestException(` ${passwordCompareError.message}`);
    }
    return validPassword;
  }

  async generateAccessToken(user) {
    const payload = { id: user._id, name: user.name, email: user.email };

    const [accessToken, signJwtAccessTokenError] = await of(
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET,
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
      })
    );
    if (signJwtAccessTokenError) {
      throw new BadRequestException(` ${signJwtAccessTokenError.message}`);
    }
    return accessToken;
  }

  async generateRefreshToken(user) {
    const payload = { id: user._id, name: user.name, email: user.email };

    const [refreshToken, signJwtRefreshTokenError] = await of(
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
      })
    );
    if (signJwtRefreshTokenError) {
      throw new BadRequestException(` ${signJwtRefreshTokenError.message}`);
    }
    return refreshToken;
  }

  async verifyAccessToken(token) {
    const [user, verifyingAccessTokenError] = await of(
      this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET,
      })
    );
    if (verifyingAccessTokenError) {
      throw new BadRequestException(` ${verifyingAccessTokenError.message}`);
    }
    return user;
  }
  async verifyRefreshToken(token) {
    const [user, verifyingRefreshToken] = await of(
      this.jwtService.verify(token, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      })
    );
    if (verifyingRefreshToken) {
      throw new BadRequestException(` ${verifyingRefreshToken.message}`);
    }
    return user;
  }
}

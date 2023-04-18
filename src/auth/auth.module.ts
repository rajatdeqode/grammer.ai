import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { GoogleStrategy } from './google.strategy';

@Module({
  providers: [JwtService, JwtStrategy, AuthService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [JwtService, JwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}

import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { of } from 'await-of';
import { messages } from 'src/utils/constants';
const { UNAUTHORIZED } = messages;

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization.split(' ')[1];

    const [user, verifyingTokenError] = await of(
      this.authService.verifyAccessToken(token)
    );
    if (verifyingTokenError) {
      throw new BadRequestException(` ${verifyingTokenError.message}`);
    }

    if (!user) {
      return res.status(401).send(UNAUTHORIZED);
    }

    req.user = user;
    next();
  }
}

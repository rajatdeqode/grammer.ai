import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { messages } from 'src/utils/constants';
const { UNAUTHORIZED, TOKEN_NOT_FOUND } = messages;

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      throw new BadRequestException(TOKEN_NOT_FOUND);
    }

    const user = await this.authService.verifyAccessToken(token);
    if (!user) {
      return res.status(401).send(UNAUTHORIZED);
    }

    req.user = user;
    next();
  }
}

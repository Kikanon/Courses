import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { RequestWithUser } from 'interfaces/auth.interface';
import Logging from 'library/Logging';
import { AuthService } from 'modules/auth/auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    if (req.cookies && req.cookies['access_token']) {
      try {
        req.user = await this.authService.user(req.cookies['access_token']);
      } catch (error) {
        res.clearCookie('access_token');
        Logging.error(error);
      }
    }
    if (next) {
      next();
    }
  }
}

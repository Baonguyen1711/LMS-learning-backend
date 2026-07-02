import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { LmsService } from './lms.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly lmsService: LmsService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const sessionId = req.cookies?.sessionId;
    const session = this.lmsService.getSession(sessionId);
    if (session) {
      req.user = session;
    }
    next();
  }
}

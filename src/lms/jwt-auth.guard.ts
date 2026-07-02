import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const sessionToken = request.cookies?.sessionId;
    if (!sessionToken) {
      throw new UnauthorizedException('Missing session cookie');
    }

    const payload = await this.authService.verifyToken(sessionToken);
    request.user = payload;
    return true;
  }
}

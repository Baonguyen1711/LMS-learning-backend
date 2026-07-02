import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/auth/google')
export class GoogleAuthController {
  @Get()
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    return { message: 'redirecting to Google' };
  }

  @Get('callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: any) {
    return { user: req.user };
  }
}

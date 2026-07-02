import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async google(
    @Body() body: GoogleLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.loginWithGoogle(body.profile, body.role);
    response.cookie('sessionId', result.sessionToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    response.cookie('role', result.user.role, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
    });
    return {
      user: result.user,
      sessionId: result.sessionId,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: Request) {
    return request.user;
  }
}

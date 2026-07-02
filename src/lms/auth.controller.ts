import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GoogleLoginDto } from './dto/google-login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google')
  async google(@Body() body: GoogleLoginDto) {
    return this.authService.loginWithGoogle(body.profile, body.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() request: Request) {
    return request.user;
  }
}

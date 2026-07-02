import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LmsService } from './lms.service';

@Controller('api')
export class LmsController {
  constructor(private readonly lmsService: LmsService) {}

  @Post('auth/google')
  async googleLogin(
    @Body('googleIdToken') googleIdToken: string,
    @Body('role') role: string,
    @Body('profile') profile: { email: string; name: string; picture?: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = this.lmsService.authenticateGoogle(googleIdToken, role as any, profile);
    response.cookie('sessionId', user.sessionId, {
      httpOnly: true,
      sameSite: 'lax',
    });
    response.cookie('role', user.user.role, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return user;
  }

  @Get('me')
  getCurrentUser(@Req() request: Request) {
    const sessionId = request.cookies?.sessionId;
    const user = this.lmsService.getUserBySession(sessionId);
    if (!user) {
      throw new UnauthorizedException('Not authenticated');
    }
    return user;
  }

  @Post('grades')
  createGrade(@Body() body: { name: string; description: string; teacherId: string }) {
    return this.lmsService.createGrade(body.name, body.description, body.teacherId);
  }

  @Post('classes')
  createClass(@Body() body: { name: string; gradeId: string; teacherId: string }) {
    return this.lmsService.createClass(body.name, body.gradeId, body.teacherId);
  }
}

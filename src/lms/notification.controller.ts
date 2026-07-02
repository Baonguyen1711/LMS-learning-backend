import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotifyUserDto } from './dto/notify-user.dto';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('api/notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  @Roles('student', 'teacher', 'assistant-teacher', 'admin')
  async list(@Param('userId') userId: string) {
    return this.notificationService.list(userId);
  }
}

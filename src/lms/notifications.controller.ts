import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('api/notifications')
@UseGuards(RolesGuard)
export class NotificationsController {
  @Get()
  @Roles('student', 'teacher', 'assistant-teacher', 'admin')
  listNotifications() {
    return {
      items: [
        { id: 'n1', title: 'New test assigned', message: 'A new test is ready for you.' },
      ],
    };
  }
}

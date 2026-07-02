import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('api/tests')
@UseGuards(RolesGuard)
export class TestBankController {
  @Post()
  @Roles('teacher')
  createTest(@Body() body: any) {
    return {
      message: 'Test upload received',
      payload: body,
      note: 'Mock implementation for teacher test upload and test bank storage.',
    };
  }
}

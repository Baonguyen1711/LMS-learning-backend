import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CreateTheoremDto } from './dto/create-theorem.dto';
import { SearchTheoremsDto } from './dto/search-theorems.dto';
import { TheoremService } from './theorem.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('api/theorems')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TheoremController {
  constructor(private readonly theoremService: TheoremService) {}

  @Get()
  @Roles('teacher', 'student', 'assistant-teacher', 'admin')
  async search(@Query() query: SearchTheoremsDto) {
    return this.theoremService.search(query.query);
  }

  @Post()
  @Roles('teacher', 'admin')
  async create(@Body() body: CreateTheoremDto) {
    return this.theoremService.create(body);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassroomEntity, GradeEntity, UserEntity } from './entities';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateGradeDto } from './dto/create-grade.dto';
import { CreateClassDto } from './dto/create-class.dto';

@Controller('api/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(GradeEntity)
    private readonly gradeRepository: Repository<GradeEntity>,
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
  ) {}

  @Get('users')
  @Roles('admin')
  async listUsers() {
    return this.userRepository.find();
  }

  @Post('users')
  @Roles('admin')
  async createUser(@Body() body: CreateUserDto) {
    const user = this.userRepository.create(body);
    return this.userRepository.save(user);
  }

  @Patch('users/:id')
  @Roles('admin')
  async updateUser(@Param('id') id: string, @Body() body: Partial<CreateUserDto>) {
    await this.userRepository.update(id, body);
    return this.userRepository.findOne({ where: { id } });
  }

  @Patch('users/:id/suspend')
  @Roles('admin')
  async suspendUser(@Param('id') id: string) {
    await this.userRepository.update(id, { isSuspended: true });
    return this.userRepository.findOne({ where: { id } });
  }

  @Delete('users/:id')
  @Roles('admin')
  async deleteUser(@Param('id') id: string) {
    await this.userRepository.delete(id);
    return { deleted: true };
  }

  @Get('grades')
  @Roles('admin')
  async listGrades() {
    return this.gradeRepository.find();
  }

  @Post('grades')
  @Roles('admin')
  async createAdminGrade(@Body() body: CreateGradeDto) {
    const grade = this.gradeRepository.create({
      name: body.name,
      description: body.description,
      code: `GRADE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      teacherId: body.teacherId,
    });
    return this.gradeRepository.save(grade);
  }

  @Patch('grades/:id')
  @Roles('admin')
  async updateGrade(@Param('id') id: string, @Body() body: Partial<CreateGradeDto>) {
    await this.gradeRepository.update(id, body);
    return this.gradeRepository.findOne({ where: { id } });
  }

  @Delete('grades/:id')
  @Roles('admin')
  async deleteGrade(@Param('id') id: string) {
    await this.gradeRepository.delete(id);
    return { deleted: true };
  }

  @Get('classes')
  @Roles('admin')
  async listClasses() {
    return this.classroomRepository.find();
  }

  @Post('classes')
  @Roles('admin')
  async createAdminClass(@Body() body: CreateClassDto) {
    const classroom = this.classroomRepository.create({
      name: body.name,
      code: `CLASS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      gradeId: body.gradeId,
      teacherId: body.teacherId,
      students: [],
    });
    return this.classroomRepository.save(classroom);
  }

  @Patch('classes/:id')
  @Roles('admin')
  async updateClass(@Param('id') id: string, @Body() body: Partial<CreateClassDto>) {
    await this.classroomRepository.update(id, body);
    return this.classroomRepository.findOne({ where: { id } });
  }

  @Delete('classes/:id')
  @Roles('admin')
  async deleteClass(@Param('id') id: string) {
    await this.classroomRepository.delete(id);
    return { deleted: true };
  }
}

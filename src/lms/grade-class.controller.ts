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
import { AddStudentDto } from './dto/add-student.dto';
import { CreateClassDto } from './dto/create-class.dto';
import { CreateGradeDto } from './dto/create-grade.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('api')
@UseGuards(JwtAuthGuard, RolesGuard)
export class GradeClassController {
  constructor(
    @InjectRepository(GradeEntity)
    private readonly gradeRepository: Repository<GradeEntity>,
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Post('grades')
  @Roles('teacher', 'admin')
  async createGrade(@Body() body: CreateGradeDto) {
    const teacher = await this.userRepository.findOne({ where: { id: body.teacherId } });
    const grade = this.gradeRepository.create({
      name: body.name,
      description: body.description,
      code: `GRADE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      teacher,
      teacherId: body.teacherId,
    });
    return this.gradeRepository.save(grade);
  }

  @Post('classes')
  @Roles('teacher', 'admin')
  async createClass(@Body() body: CreateClassDto) {
    const teacher = await this.userRepository.findOne({ where: { id: body.teacherId } });
    const grade = await this.gradeRepository.findOne({ where: { id: body.gradeId } });
    const classroom = this.classroomRepository.create({
      name: body.name,
      code: `CLASS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      grade,
      gradeId: body.gradeId,
      teacher,
      teacherId: body.teacherId,
      students: [],
    });
    return this.classroomRepository.save(classroom);
  }

  @Get('grades')
  @Roles('teacher', 'admin', 'student', 'assistant-teacher')
  async listGrades() {
    return this.gradeRepository.find();
  }

  @Get('classes')
  @Roles('teacher', 'admin', 'student', 'assistant-teacher')
  async listClasses() {
    return this.classroomRepository.find();
  }

  @Patch('classes/:id/students')
  @Roles('teacher', 'admin')
  async addStudent(@Param('id') id: string, @Body() body: AddStudentDto) {
    const classroom = await this.classroomRepository.findOne({ where: { id }, relations: ['students'] });
    const student = await this.userRepository.findOne({ where: { id: body.studentId } });
    if (!classroom || !student) {
      return { message: 'Classroom or student not found' };
    }
    classroom.students = [...(classroom.students ?? []), student];
    return this.classroomRepository.save(classroom);
  }

  @Delete('classes/:id/students/:studentId')
  @Roles('teacher', 'admin')
  async removeStudent(@Param('id') id: string, @Param('studentId') studentId: string) {
    const classroom = await this.classroomRepository.findOne({ where: { id }, relations: ['students'] });
    if (!classroom) {
      return { message: 'Classroom not found' };
    }
    classroom.students = classroom.students?.filter((student) => student.id !== studentId) ?? [];
    return this.classroomRepository.save(classroom);
  }
}

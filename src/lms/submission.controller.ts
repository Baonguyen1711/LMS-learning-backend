import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentEntity, SubmissionEntity, UserEntity } from './entities';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { SubmitSubmissionDto } from './dto/submit-submission.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('api/submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionController {
  constructor(
    @InjectRepository(SubmissionEntity)
    private readonly submissionRepository: Repository<SubmissionEntity>,
    @InjectRepository(AssignmentEntity)
    private readonly assignmentRepository: Repository<AssignmentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Post()
  @Roles('student')
  async submit(@Body() body: SubmitSubmissionDto) {
    const assignment = await this.assignmentRepository.findOne({ where: { id: body.assignmentId } });
    const student = await this.userRepository.findOne({ where: { id: body.studentId } });
    const submission = this.submissionRepository.create({
      assignment,
      assignmentId: body.assignmentId,
      student,
      studentId: body.studentId,
      answers: body.answers,
      status: 'submitted',
      submittedAt: new Date(),
    });
    return this.submissionRepository.save(submission);
  }

  @Get()
  @Roles('student', 'teacher', 'assistant-teacher', 'admin')
  async list(@Query('studentId') studentId?: string) {
    if (studentId) {
      return this.submissionRepository.find({ where: { studentId }, relations: ['assignment'] });
    }
    return this.submissionRepository.find({ relations: ['assignment', 'student'] });
  }

  @Post(':id/grade')
  @Roles('teacher', 'assistant-teacher', 'admin')
  async grade(@Param('id') id: string, @Body() body: GradeSubmissionDto) {
    const submission = await this.submissionRepository.findOne({ where: { id } });
    if (!submission) {
      return { message: 'Submission not found' };
    }
    submission.score = body.score;
    submission.feedback = body.feedback;
    submission.status = 'graded';
    submission.gradedById = body.gradedById;
    submission.gradedAt = new Date();
    return this.submissionRepository.save(submission);
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignmentEntity, TestEntity, TestFileEntity, UserEntity } from './entities';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { CreateTestDto } from './dto/create-test.dto';
import { FileUploadService } from './file-upload.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('api/tests')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TestController {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepository: Repository<TestEntity>,
    @InjectRepository(TestFileEntity)
    private readonly testFileRepository: Repository<TestFileEntity>,
    @InjectRepository(AssignmentEntity)
    private readonly assignmentRepository: Repository<AssignmentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post()
  @Roles('teacher', 'admin')
  @UseInterceptors(FilesInterceptor('files'))
  async createTest(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: CreateTestDto & { answerKey?: string },
  ) {
    const owner = await this.userRepository.findOne({ where: { id: body.ownerId } });
    const test = this.testRepository.create({
      title: body.title,
      description: body.description,
      questionType: body.questionType,
      difficulty: body.difficulty,
      gradeLevel: body.gradeLevel,
      hashtags: body.hashtags,
      answerKey: body.answerKey ? JSON.parse(body.answerKey) : undefined,
      answerFormat: body.answerFormat,
      latexTemplate: body.latexTemplate,
      owner,
      ownerId: body.ownerId,
    });
    const savedTest = await this.testRepository.save(test);

    if (files?.length) {
      const fileEntities = [] as TestFileEntity[];
      for (const file of files) {
        const uploadResult = await this.fileUploadService.uploadFile(file, `tests/${savedTest.id}/${file.originalname}`);
        const fileEntity = this.testFileRepository.create({
          test: savedTest,
          testId: savedTest.id,
          fileName: file.originalname,
          storagePath: uploadResult.url,
          mimeType: file.mimetype,
          kind: 'test',
        });
        fileEntities.push(fileEntity);
      }
      await this.testFileRepository.save(fileEntities);
    }

    return savedTest;
  }

  @Get()
  @Roles('teacher', 'admin', 'student', 'assistant-teacher')
  async listTests(@Query('q') q?: string) {
    if (!q) {
      return this.testRepository.find({ relations: ['files'] });
    }
    return this.testRepository
      .createQueryBuilder('test')
      .where('test.title ILIKE :q', { q: `%${q}%` })
      .orWhere('test.hashtags ILIKE :q', { q: `%${q}%` })
      .getMany();
  }

  @Post(':id/assign')
  @Roles('teacher', 'admin')
  async assignTest(@Param('id') id: string, @Body() body: CreateAssignmentDto) {
    const test = await this.testRepository.findOne({ where: { id } });
    const assignment = this.assignmentRepository.create({
      test,
      testId: id,
      gradeId: body.gradeId,
      classId: body.classId,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      showAnswersAfterSubmission: body.showAnswersAfterSubmission ?? true,
      maxRetries: body.maxRetries ?? 1,
      displayMode: body.displayMode ?? 'all-at-once',
      antiCheatEnabled: body.antiCheatEnabled ?? false,
      createdById: body.createdById,
      createdBy: await this.userRepository.findOne({ where: { id: body.createdById } }),
    });
    return this.assignmentRepository.save(assignment);
  }
}

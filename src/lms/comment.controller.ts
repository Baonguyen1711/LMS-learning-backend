import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity, UserEntity } from './entities';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

@Controller('api/comments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CommentController {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  @Post()
  @Roles('student', 'teacher', 'assistant-teacher', 'admin')
  async create(@Body() body: CreateCommentDto) {
    const author = await this.userRepository.findOne({ where: { id: body.authorId } });
    const comment = this.commentRepository.create({
      content: body.content,
      targetType: body.targetType,
      targetId: body.targetId,
      author,
      authorId: body.authorId,
    });
    return this.commentRepository.save(comment);
  }

  @Get()
  @Roles('student', 'teacher', 'assistant-teacher', 'admin')
  async list(@Query('targetType') targetType?: string, @Query('targetId') targetId?: string) {
    return this.commentRepository.find({ where: { targetType, targetId } });
  }
}

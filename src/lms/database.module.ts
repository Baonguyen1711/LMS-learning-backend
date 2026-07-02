import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  AssignmentEntity,
  ClassroomEntity,
  CommentEntity,
  GradeEntity,
  NotificationEntity,
  SubmissionEntity,
  TestEntity,
  TestFileEntity,
  TheoremEntity,
  UserEntity,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: Number(process.env.POSTGRES_PORT ?? 5432),
      username: process.env.POSTGRES_USER ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? 'postgres',
      database: process.env.POSTGRES_DB ?? 'lms_backend',
      entities: [
        UserEntity,
        GradeEntity,
        ClassroomEntity,
        TestEntity,
        TestFileEntity,
        AssignmentEntity,
        SubmissionEntity,
        CommentEntity,
        TheoremEntity,
        NotificationEntity,
      ],
      synchronize: true,
      ssl: false,
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      GradeEntity,
      ClassroomEntity,
      TestEntity,
      TestFileEntity,
      AssignmentEntity,
      SubmissionEntity,
      CommentEntity,
      TheoremEntity,
      NotificationEntity,
    ]),
  ],
})
export class DatabaseModule {}

import { DataSource } from 'typeorm';
import { appConfig } from './src/lms/app-config';
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
} from './src/lms/entities';

export default new DataSource({
  type: 'postgres',
  host: appConfig.postgres.host,
  port: appConfig.postgres.port,
  username: appConfig.postgres.username,
  password: appConfig.postgres.password,
  database: appConfig.postgres.database,
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
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

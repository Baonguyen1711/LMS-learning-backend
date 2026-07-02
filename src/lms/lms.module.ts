import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthController } from './auth.controller';
import { EmailService } from './email.service';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleStrategy } from './google.strategy';
import { AuthService } from './auth.service';
import { CommentController } from './comment.controller';
import { FileUploadService } from './file-upload.service';
import { GradeClassController } from './grade-class.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LmsController } from './lms.controller';
import { LmsService } from './lms.service';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { RolesGuard } from './roles.guard';
import { SubmissionController } from './submission.controller';
import { TestController } from './test.controller';
import { TheoremController } from './theorem.controller';
import { TheoremService } from './theorem.service';
import { UserEntity, GradeEntity, ClassroomEntity, TestEntity, TestFileEntity, AssignmentEntity, SubmissionEntity, CommentEntity, TheoremEntity, NotificationEntity } from './entities';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'change-me',
      signOptions: { expiresIn: '8h' },
    }),
    TypeOrmModule.forFeature([UserEntity, GradeEntity, ClassroomEntity, TestEntity, TestFileEntity, AssignmentEntity, SubmissionEntity, CommentEntity, TheoremEntity, NotificationEntity]),
  ],
  controllers: [
    AuthController,
    GoogleAuthController,
    AdminController,
    LmsController,
    GradeClassController,
    TestController,
    SubmissionController,
    CommentController,
    TheoremController,
    NotificationController,
  ],
  providers: [
    LmsService,
    AuthService,
    GoogleStrategy,
    FileUploadService,
    EmailService,
    AdminService,
    JwtAuthGuard,
    TheoremService,
    NotificationService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [LmsService, AuthService],
})
export class LmsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply((req, _res, next) => next()).forRoutes('*');
  }
}

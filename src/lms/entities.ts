import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type UserRole = 'admin' | 'teacher' | 'assistant-teacher' | 'student';
export type QuestionType = 'multiple-choice' | 'short-text' | 'long-text';
export type AssignmentDisplayMode = 'all-at-once' | 'one-by-one';
export type SubmissionStatus = 'draft' | 'submitted' | 'graded';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column() name: string;

  @Column({ nullable: true })
  picture?: string;

  @Column({ type: 'varchar', default: 'student' })
  role: UserRole;

  @Column({ nullable: true })
  googleId?: string;

  @Column({ default: false })
  isSuspended: boolean;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  @OneToMany(() => GradeEntity, (grade) => grade.teacher)
  managedGrades: GradeEntity[];

  @OneToMany(() => ClassroomEntity, (classroom) => classroom.teacher)
  managedClasses: ClassroomEntity[];

  @ManyToMany(() => ClassroomEntity, (classroom) => classroom.students)
  @JoinTable()
  enrolledClasses: ClassroomEntity[];
}

@Entity('grades')
export class GradeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => UserEntity, (user) => user.managedGrades, { eager: true })
  @JoinColumn({ name: 'teacherId' })
  teacher: UserEntity;

  @Column() teacherId: string;

  @OneToMany(() => ClassroomEntity, (classroom) => classroom.grade)
  classes: ClassroomEntity[];

  @CreateDateColumn() createdAt: Date;
}

@Entity('classrooms')
export class ClassroomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() name: string;

  @Column({ unique: true })
  code: string;

  @ManyToOne(() => GradeEntity, (grade) => grade.classes, { eager: true })
  @JoinColumn({ name: 'gradeId' })
  grade: GradeEntity;

  @Column() gradeId: string;

  @ManyToOne(() => UserEntity, (user) => user.managedClasses, { eager: true })
  @JoinColumn({ name: 'teacherId' })
  teacher: UserEntity;

  @Column() teacherId: string;

  @ManyToMany(() => UserEntity, (user) => user.enrolledClasses, { eager: true })
  students: UserEntity[];

  @CreateDateColumn() createdAt: Date;
}

@Entity('tests')
export class TestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'varchar' })
  questionType: QuestionType;

  @Column({ nullable: true })
  difficulty?: string;

  @Column({ nullable: true })
  gradeLevel?: string;

  @Column({ nullable: true })
  hashtags?: string;

  @Column({ type: 'simple-json', nullable: true })
  answerKey?: Record<string, unknown>;

  @Column({ type: 'varchar', nullable: true })
  answerFormat?: string;

  @Column({ nullable: true })
  latexTemplate?: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;

  @Column() ownerId: string;

  @OneToMany(() => TestFileEntity, (file) => file.test, { cascade: true })
  files: TestFileEntity[];

  @CreateDateColumn() createdAt: Date;
}

@Entity('test_files')
export class TestFileEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TestEntity, (test) => test.files)
  @JoinColumn({ name: 'testId' })
  test: TestEntity;

  @Column() testId: string;

  @Column() fileName: string;

  @Column() storagePath: string;

  @Column() mimeType: string;

  @Column({ type: 'varchar' })
  kind: 'test' | 'answer' | 'supporting';

  @CreateDateColumn() createdAt: Date;
}

@Entity('assignments')
export class AssignmentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TestEntity, { eager: true })
  @JoinColumn({ name: 'testId' })
  test: TestEntity;

  @Column() testId: string;

  @ManyToOne(() => GradeEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'gradeId' })
  grade?: GradeEntity;

  @Column({ nullable: true })
  gradeId?: string;

  @ManyToOne(() => ClassroomEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'classId' })
  classroom?: ClassroomEntity;

  @Column({ nullable: true })
  classId?: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ default: true })
  showAnswersAfterSubmission: boolean;

  @Column({ default: 1 })
  maxRetries: number;

  @Column({ default: 'all-at-once' })
  displayMode: AssignmentDisplayMode;

  @Column({ default: false })
  antiCheatEnabled: boolean;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'createdById' })
  createdBy: UserEntity;

  @Column() createdById: string;

  @CreateDateColumn() createdAt: Date;
}

@Entity('submissions')
export class SubmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AssignmentEntity, { eager: true })
  @JoinColumn({ name: 'assignmentId' })
  assignment: AssignmentEntity;

  @Column() assignmentId: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'studentId' })
  student: UserEntity;

  @Column() studentId: string;

  @Column({ type: 'simple-json', nullable: true })
  answers?: Record<string, unknown>;

  @Column({ nullable: true })
  score?: number;

  @Column({ default: 'draft' })
  status: SubmissionStatus;

  @Column({ nullable: true })
  feedback?: string;

  @ManyToOne(() => UserEntity, { eager: true, nullable: true })
  @JoinColumn({ name: 'gradedById' })
  gradedBy?: UserEntity;

  @Column({ nullable: true })
  gradedById?: string;

  @CreateDateColumn() createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  gradedAt?: Date;
}

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() content: string;

  @Column() targetType: string;

  @Column() targetId: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @Column() authorId: string;

  @Column({ default: false })
  isRemoved: boolean;

  @Column({ default: false })
  isBanned: boolean;

  @CreateDateColumn() createdAt: Date;
}

@Entity('theorems')
export class TheoremEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() title: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'text', nullable: true })
  latexContent?: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ nullable: true })
  storagePath?: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner: UserEntity;

  @Column() ownerId: string;

  @CreateDateColumn() createdAt: Date;
}

@Entity('notifications')
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column() userId: string;

  @Column() title: string;

  @Column() message: string;

  @Column({ nullable: true })
  kind?: string;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  @CreateDateColumn() createdAt: Date;
}

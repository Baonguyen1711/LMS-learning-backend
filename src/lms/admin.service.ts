import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassroomEntity, GradeEntity, UserEntity } from './entities';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(GradeEntity)
    private readonly gradeRepository: Repository<GradeEntity>,
    @InjectRepository(ClassroomEntity)
    private readonly classroomRepository: Repository<ClassroomEntity>,
  ) {}

  async listUsers() {
    return this.userRepository.find();
  }

  async listGrades() {
    return this.gradeRepository.find();
  }

  async listClasses() {
    return this.classroomRepository.find();
  }
}

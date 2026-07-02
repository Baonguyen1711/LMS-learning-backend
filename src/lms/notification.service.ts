import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity, UserEntity } from './entities';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private readonly notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(userId: string, title: string, message: string, kind?: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const notification = this.notificationRepository.create({
      user,
      userId,
      title,
      message,
      kind,
    });
    return this.notificationRepository.save(notification);
  }

  async list(userId: string) {
    return this.notificationRepository.find({ where: { userId } });
  }
}

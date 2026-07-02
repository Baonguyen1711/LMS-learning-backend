import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TheoremEntity, UserEntity } from './entities';

@Injectable()
export class TheoremService {
  constructor(
    @InjectRepository(TheoremEntity)
    private readonly theoremRepository: Repository<TheoremEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(payload: { title: string; content?: string; latexContent?: string; fileName?: string; storagePath?: string; ownerId: string }) {
    const owner = await this.userRepository.findOne({ where: { id: payload.ownerId } });
    const theorem = this.theoremRepository.create({
      title: payload.title,
      content: payload.content,
      latexContent: payload.latexContent,
      fileName: payload.fileName,
      storagePath: payload.storagePath,
      owner,
      ownerId: payload.ownerId,
    });
    return this.theoremRepository.save(theorem);
  }

  async search(query?: string) {
    if (!query) {
      return this.theoremRepository.find();
    }
    return this.theoremRepository
      .createQueryBuilder('theorem')
      .where('theorem.title ILIKE :q', { q: `%${query}%` })
      .orWhere('theorem.content ILIKE :q', { q: `%${query}%` })
      .getMany();
  }
}

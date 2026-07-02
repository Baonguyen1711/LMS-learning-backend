import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from './entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithGoogle(profile: { email: string; name: string; picture?: string; googleId?: string }, role: UserRole) {
    let user = await this.userRepository.findOne({ where: { email: profile.email } });
    if (!user) {
      user = this.userRepository.create({
        email: profile.email,
        name: profile.name,
        picture: profile.picture,
        googleId: profile.googleId,
        role,
      });
      user = await this.userRepository.save(user);
    }

    const sessionId = `sess_${user.id}_${Date.now()}`;
    const sessionToken = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role, sessionId }, { expiresIn: '8h' });
    return { user, accessToken: sessionToken, sessionToken, sessionId };
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}

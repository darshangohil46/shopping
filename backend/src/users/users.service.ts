import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async create(userData: {
    name: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const user = this.userRepository.create({
      name: userData.name.trim(),
      email: userData.email.toLowerCase().trim(),
      password: userData.passwordHash,
    });
    return this.userRepository.save(user);
  }
}

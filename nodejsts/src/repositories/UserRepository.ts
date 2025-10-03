import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { BaseRepository } from './BaseRepository';
import { AppError } from '../middleware/errorHandler';

export class UserRepository extends BaseRepository<User> {
  private userRepository: Repository<User>;

  constructor() {
    super(User);
    this.userRepository = AppDataSource.getRepository(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const existingUser = await this.findByEmail(userData.email!);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }
    return await this.create(userData);
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    if (userData.email) {
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new AppError('User with this email already exists', 409);
      }
    }
    return await this.update(id, userData);
  }
}
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { ResetToken } from '../entities/ResetToken';
import { BaseRepository } from './BaseRepository';

export class ResetTokenRepository extends BaseRepository<ResetToken> {
  private resetTokenRepository: Repository<ResetToken>;

  constructor() {
    super(ResetToken);
    this.resetTokenRepository = AppDataSource.getRepository(ResetToken);
  }

  async findByTokenHash(tokenHash: string): Promise<ResetToken | null> {
    return await this.resetTokenRepository.findOne({ where: { tokenHash } });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.resetTokenRepository.delete({ userId });
  }

  async markAsUsed(id: string): Promise<void> {
    await this.resetTokenRepository.update(id, { usedAt: new Date() });
  }
}
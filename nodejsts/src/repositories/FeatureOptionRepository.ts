import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { FeatureOption } from '../entities/FeatureOption';
import { BaseRepository } from './BaseRepository';

export class FeatureOptionRepository extends BaseRepository<FeatureOption> {
  private featureOptionRepository: Repository<FeatureOption>;

  constructor() {
    super(FeatureOption);
    this.featureOptionRepository = AppDataSource.getRepository(FeatureOption);
  }

  async findAllGrouped(): Promise<Record<string, string[]>> {
    const allOptions = await this.featureOptionRepository.find();
    return allOptions.reduce((acc, option) => {
      const { category, value } = option;
      if (!acc[category]) acc[category] = [];
      acc[category].push(value);
      return acc;
    }, {} as Record<string, string[]>);
  }

  async findByCategoryAndValue(category: string, value: string): Promise<FeatureOption | null> {
    return await this.featureOptionRepository.findOne({ where: { category, value } });
  }
}
import { FeatureOptionRepository } from '../repositories/FeatureOptionRepository';
import { FeatureOption } from '../types';
import { AppError } from '../middleware/errorHandler';

export class FeatureOptionService {
  private featureOptionRepository: FeatureOptionRepository;

  constructor() {
    this.featureOptionRepository = new FeatureOptionRepository();
  }

  async createFeatureOption(featureOptionData: Partial<FeatureOption>): Promise<FeatureOption> {
    const existingOption = await this.featureOptionRepository.findByCategoryAndValue(
      featureOptionData.category!,
      featureOptionData.value!
    );

    if (existingOption) {
      throw new AppError('This feature already exists', 409);
    }

    return await this.featureOptionRepository.create(featureOptionData);
  }

  async getAllFeatureOptions(): Promise<FeatureOption[]> {
    return await this.featureOptionRepository.findAll();
  }

  async getAllFeatureOptionsGrouped(): Promise<Record<string, string[]>> {
    return await this.featureOptionRepository.findAllGrouped();
  }

  async getFeatureOptionById(id: string): Promise<FeatureOption> {
    const featureOption = await this.featureOptionRepository.findById(id);
    if (!featureOption) {
      throw new AppError('Feature option not found', 404);
    }
    return featureOption;
  }

  async updateFeatureOption(id: string, featureOptionData: Partial<FeatureOption>): Promise<FeatureOption> {
    const existingOption = await this.featureOptionRepository.findById(id);
    if (!existingOption) {
      throw new AppError('Feature option not found', 404);
    }

    if (featureOptionData.category || featureOptionData.value) {
      const potentialDuplicate = await this.featureOptionRepository.findByCategoryAndValue(
        featureOptionData.category || existingOption.category,
        featureOptionData.value || existingOption.value
      );

      if (potentialDuplicate && potentialDuplicate._id.toString() !== id) {
        throw new AppError('Update would result in duplicate feature option', 409);
      }
    }

    const updatedOption = await this.featureOptionRepository.update(id, featureOptionData);
    if (!updatedOption) {
      throw new AppError('Feature option not found', 404);
    }

    return updatedOption;
  }

  async deleteFeatureOption(id: string): Promise<{ message: string }> {
    const deleted = await this.featureOptionRepository.delete(id);
    if (!deleted) {
      throw new AppError('Feature option not found', 404);
    }
    return { message: 'Feature option deleted successfully' };
  }
}
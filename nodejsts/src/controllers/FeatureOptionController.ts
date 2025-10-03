import { Request, Response } from 'express';
import { FeatureOptionService } from '../services/FeatureOptionService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export class FeatureOptionController {
  private featureOptionService: FeatureOptionService;

  constructor() {
    this.featureOptionService = new FeatureOptionService();
  }

  createFeatureOption = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const featureOption = await this.featureOptionService.createFeatureOption(req.body);
    const response: ApiResponse = {
      success: true,
      data: featureOption,
      message: 'Feature option created successfully'
    };
    res.status(201).json(response);
  });

  getAllFeatureOptionsGrouped = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const featureOptions = await this.featureOptionService.getAllFeatureOptionsGrouped();
    const response: ApiResponse = {
      success: true,
      data: featureOptions,
      message: 'Feature options retrieved successfully'
    };
    res.status(200).json(response);
  });

  getAllFeatureOptions = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const featureOptions = await this.featureOptionService.getAllFeatureOptions();
    const response: ApiResponse = {
      success: true,
      data: featureOptions,
      message: 'All feature options retrieved successfully'
    };
    res.status(200).json(response);
  });

  getFeatureOptionById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const featureOptionId = req.params.id;
    if (!featureOptionId) {
      res.status(400).json({ success: false, message: 'Feature option ID is required' });
      return;
    }

    const featureOption = await this.featureOptionService.getFeatureOptionById(featureOptionId);
    const response: ApiResponse = {
      success: true,
      data: featureOption,
      message: 'Feature option retrieved successfully'
    };
    res.status(200).json(response);
  });

  updateFeatureOption = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const featureOptionId = req.params.id;
    if (!featureOptionId) {
      res.status(400).json({ success: false, message: 'Feature option ID is required' });
      return;
    }

    const featureOption = await this.featureOptionService.updateFeatureOption(featureOptionId, req.body);
    const response: ApiResponse = {
      success: true,
      data: featureOption,
      message: 'Feature option updated successfully'
    };
    res.status(200).json(response);
  });

  deleteFeatureOption = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const featureOptionId = req.params.id;
    if (!featureOptionId) {
      res.status(400).json({ success: false, message: 'Feature option ID is required' });
      return;
    }

    const result = await this.featureOptionService.deleteFeatureOption(featureOptionId);
    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Feature option deleted successfully'
    };
    res.status(200).json(response);
  });
}
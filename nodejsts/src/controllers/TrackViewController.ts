import { Request, Response } from 'express';
import { TrackViewService } from '../services/TrackViewService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export class TrackViewController {
  private trackViewService: TrackViewService;

  constructor() {
    this.trackViewService = new TrackViewService();
  }

  trackView = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const track = await this.trackViewService.trackView();
    const response: ApiResponse = {
      success: true,
      data: track,
      message: 'View tracked successfully'
    };
    res.status(200).json(response);
  });

  getCurrentYearStats = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const stats = await this.trackViewService.getCurrentYearStats();
    const response: ApiResponse = {
      success: true,
      data: stats,
      message: 'Current year stats retrieved successfully'
    };
    res.status(200).json(response);
  });

  getCurrentMonthTotalViews = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const totalViews = await this.trackViewService.getCurrentMonthTotalViews();
    const response: ApiResponse = {
      success: true,
      data: { totalViews },
      message: 'Current month total views retrieved successfully'
    };
    res.status(200).json(response);
  });
}
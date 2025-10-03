import { Request, Response } from 'express';
import { ClientIntakeService } from '../services/ClientIntakeService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export class ClientIntakeController {
  private clientIntakeService: ClientIntakeService;

  constructor() {
    this.clientIntakeService = new ClientIntakeService();
  }

  createClientIntake = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clientIntake = await this.clientIntakeService.createClientIntake(req.body);
    const response: ApiResponse = {
      success: true,
      data: clientIntake,
      message: 'Client intake created successfully'
    };
    res.status(201).json(response);
  });

  getAllClientIntakes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clientIntakes = await this.clientIntakeService.getAllClientIntakes();
    const response: ApiResponse = {
      success: true,
      data: clientIntakes,
      message: 'Client intakes retrieved successfully'
    };
    res.status(200).json(response);
  });

  getClientIntakeById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clientIntakeId = req.params.id;
    if (!clientIntakeId) {
      res.status(400).json({ success: false, message: 'Client intake ID is required' });
      return;
    }

    const clientIntake = await this.clientIntakeService.getClientIntakeById(clientIntakeId);
    const response: ApiResponse = {
      success: true,
      data: clientIntake,
      message: 'Client intake retrieved successfully'
    };
    res.status(200).json(response);
  });

  updateClientIntake = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clientIntakeId = req.params.id;
    if (!clientIntakeId) {
      res.status(400).json({ success: false, message: 'Client intake ID is required' });
      return;
    }

    const clientIntake = await this.clientIntakeService.updateClientIntake(clientIntakeId, req.body);
    const response: ApiResponse = {
      success: true,
      data: clientIntake,
      message: 'Client intake updated successfully'
    };
    res.status(200).json(response);
  });

  deleteClientIntake = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clientIntakeId = req.params.id;
    if (!clientIntakeId) {
      res.status(400).json({ success: false, message: 'Client intake ID is required' });
      return;
    }

    const result = await this.clientIntakeService.deleteClientIntake(clientIntakeId);
    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Client intake deleted successfully'
    };
    res.status(200).json(response);
  });
}
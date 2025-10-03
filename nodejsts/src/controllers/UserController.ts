import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.createUser(req.body);
    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User created successfully'
    };
    res.status(201).json(response);
  });

  uploadUserImage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const user = await this.userService.uploadUserImage(userId, req.file);
    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User image uploaded successfully'
    };
    res.status(200).json(response);
  });

  getAllUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const users = await this.userService.findAllUsers();
    const response: ApiResponse = {
      success: true,
      data: users,
      message: 'Users retrieved successfully'
    };
    res.status(200).json(response);
  });

  getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const user = await this.userService.findUserById(userId);
    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User retrieved successfully'
    };
    res.status(200).json(response);
  });

  updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const user = await this.userService.updateUser(userId, req.body);
    const response: ApiResponse = {
      success: true,
      data: user,
      message: 'User updated successfully'
    };
    res.status(200).json(response);
  });

  updatePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const { oldPassword, newPassword } = req.body;
    const result = await this.userService.updatePassword(userId, oldPassword, newPassword);
    const response: ApiResponse = {
      success: true,
      data: result,
      message: result.message
    };
    res.status(200).json(response);
  });

  deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is required' });
      return;
    }

    const result = await this.userService.deleteUser(userId);
    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'User deleted successfully'
    };
    res.status(200).json(response);
  });
}
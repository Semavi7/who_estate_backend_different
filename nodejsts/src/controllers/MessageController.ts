import { Request, Response } from 'express';
import { MessageService } from '../services/MessageService';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

export class MessageController {
  private messageService: MessageService;

  constructor() {
    this.messageService = new MessageService();
  }

  createMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const message = await this.messageService.createMessage(req.body);
    const response: ApiResponse = {
      success: true,
      data: message,
      message: 'Message created successfully'
    };
    res.status(201).json(response);
  });

  getAllMessages = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const messages = await this.messageService.getAllMessages();
    const response: ApiResponse = {
      success: true,
      data: messages,
      message: 'Messages retrieved successfully'
    };
    res.status(200).json(response);
  });

  getMessageById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const messageId = req.params.id;
    if (!messageId) {
      res.status(400).json({ success: false, message: 'Message ID is required' });
      return;
    }

    const message = await this.messageService.getMessageById(messageId);
    const response: ApiResponse = {
      success: true,
      data: message,
      message: 'Message retrieved successfully'
    };
    res.status(200).json(response);
  });

  deleteMessage = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const messageId = req.params.id;
    if (!messageId) {
      res.status(400).json({ success: false, message: 'Message ID is required' });
      return;
    }

    const result = await this.messageService.deleteMessage(messageId);
    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Message deleted successfully'
    };
    res.status(200).json(response);
  });

  markAsRead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const messageId = req.params.id;
    if (!messageId) {
      res.status(400).json({ success: false, message: 'Message ID is required' });
      return;
    }

    const message = await this.messageService.markAsRead(messageId);
    const response: ApiResponse = {
      success: true,
      data: message,
      message: 'Message marked as read'
    };
    res.status(200).json(response);
  });
}
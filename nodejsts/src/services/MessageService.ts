import { MessageRepository } from '../repositories/MessageRepository';
import { Message } from '../types';
import { AppError } from '../middleware/errorHandler';

export class MessageService {
  private messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  async createMessage(messageData: Partial<Message>): Promise<Message> {
    return await this.messageRepository.create(messageData);
  }

  async getAllMessages(): Promise<Message[]> {
    return await this.messageRepository.findAll();
  }

  async getMessageById(id: string): Promise<Message> {
    const message = await this.messageRepository.findById(id);
    if (!message) {
      throw new AppError('Message not found', 404);
    }
    return message;
  }

  async deleteMessage(id: string): Promise<{ message: string }> {
    const deleted = await this.messageRepository.delete(id);
    if (!deleted) {
      throw new AppError('Message not found', 404);
    }
    return { message: 'Message deleted successfully' };
  }

  async markAsRead(id: string): Promise<Message> {
    const message = await this.messageRepository.findById(id);
    if (!message) {
      throw new AppError('Message not found', 404);
    }

    message.isread = true;
    const updatedMessage = await this.messageRepository.update(id, { isread: true });
    if (!updatedMessage) {
      throw new AppError('Message not found', 404);
    }

    return updatedMessage;
  }
}
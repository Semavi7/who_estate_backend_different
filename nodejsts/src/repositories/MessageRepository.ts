import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Message } from '../entities/Message';
import { BaseRepository } from './BaseRepository';

export class MessageRepository extends BaseRepository<Message> {
  private messageRepository: Repository<Message>;

  constructor() {
    super(Message);
    this.messageRepository = AppDataSource.getRepository(Message);
  }
}
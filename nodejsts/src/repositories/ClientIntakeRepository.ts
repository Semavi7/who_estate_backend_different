import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { ClientIntake } from '../entities/ClientIntake';
import { BaseRepository } from './BaseRepository';

export class ClientIntakeRepository extends BaseRepository<ClientIntake> {
  private clientIntakeRepository: Repository<ClientIntake>;

  constructor() {
    super(ClientIntake);
    this.clientIntakeRepository = AppDataSource.getRepository(ClientIntake);
  }
}
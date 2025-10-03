import { ClientIntakeRepository } from '../repositories/ClientIntakeRepository';
import { ClientIntake } from '../types';
import { AppError } from '../middleware/errorHandler';

export class ClientIntakeService {
  private clientIntakeRepository: ClientIntakeRepository;

  constructor() {
    this.clientIntakeRepository = new ClientIntakeRepository();
  }

  async createClientIntake(clientIntakeData: Partial<ClientIntake>): Promise<ClientIntake> {
    return await this.clientIntakeRepository.create(clientIntakeData);
  }

  async getAllClientIntakes(): Promise<ClientIntake[]> {
    return await this.clientIntakeRepository.findAll();
  }

  async getClientIntakeById(id: string): Promise<ClientIntake> {
    const clientIntake = await this.clientIntakeRepository.findById(id);
    if (!clientIntake) {
      throw new AppError('Client intake not found', 404);
    }
    return clientIntake;
  }

  async updateClientIntake(id: string, clientIntakeData: Partial<ClientIntake>): Promise<ClientIntake> {
    const updatedClientIntake = await this.clientIntakeRepository.update(id, clientIntakeData);
    if (!updatedClientIntake) {
      throw new AppError('Client intake not found', 404);
    }
    return updatedClientIntake;
  }

  async deleteClientIntake(id: string): Promise<{ message: string }> {
    const deleted = await this.clientIntakeRepository.delete(id);
    if (!deleted) {
      throw new AppError('Client intake not found', 404);
    }
    return { message: 'Client intake deleted successfully' };
  }
}
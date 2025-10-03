import { Repository, ObjectLiteral, FindOptionsWhere, ObjectId } from 'typeorm';
import { AppDataSource } from '../config/database';
import { AppError } from '../middleware/errorHandler';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(entityClass: new () => T) {
    this.repository = AppDataSource.getRepository(entityClass);
  }

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.repository.findOneBy({ _id: new ObjectId(id) } as unknown as FindOptionsWhere<T>);
    } catch (error) {
      throw new AppError('Invalid ID format', 400);
    }
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = this.repository.create(data as T);
    return await this.repository.save(entity);
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const entity = await this.findById(id);
      if (!entity) {
        return null;
      }
      Object.assign(entity, data);
      return await this.repository.save(entity);
    } catch (error) {
      throw new AppError('Invalid ID format', 400);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.repository.delete(new ObjectId(id));
      return result.affected !== 0;
    } catch (error) {
      throw new AppError('Invalid ID format', 400);
    }
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
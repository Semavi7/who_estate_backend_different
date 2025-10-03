import { Repository, MongoRepository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Property } from '../entities/Property';
import { BaseRepository } from './BaseRepository';
import { ObjectId } from 'mongodb';

export class PropertyRepository extends BaseRepository<Property> {
  private propertyRepository: MongoRepository<Property>;

  constructor() {
    super(Property);
    this.propertyRepository = AppDataSource.getMongoRepository(Property);
  }

  async createCollectionIndex(): Promise<void> {
    await this.propertyRepository.createCollectionIndex({ 'location.geo': '2dsphere' });
  }

  async findNear(lon: number, lat: number, distance: number): Promise<Property[]> {
    return await this.propertyRepository.find({
      where: {
        'location.geo': {
          $nearSphere: {
            $geometry: { type: 'Point', coordinates: [lon, lat] },
            $maxDistance: distance
          }
        }
      }
    });
  }

  async findLastSix(): Promise<Property[]> {
    return await this.propertyRepository.find({
      order: { createdAt: 'DESC' },
      take: 6
    });
  }

  async queryProperties(queryParams: any): Promise<Property[]> {
    const where: any = {};
    const numericFields = ['price', 'gross', 'net', 'buildingAge', 'floor', 'numberOfFloors', 'numberOfBathrooms', 'dues'];

    for (const key in queryParams) {
      if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
        const value = queryParams[key];
        if (key === 'city' || key === 'district' || key === 'neighborhood') {
          where[`location.${key}`] = value;
        } else if (numericFields.includes(key)) {
          where[key] = parseInt(value, 10);
        } else if (key === 'minNet' || key === 'minPrice') {
          const field = key.substring(3).toLowerCase();
          where[field] = { $gte: parseInt(value, 10) };
        } else if (key === 'maxNet' || key === 'maxPrice') {
          const field = key.substring(3).toLowerCase();
          where[field] = { ...where[field], $lte: parseInt(value, 10) };
        } else {
          where[key] = value;
        }
      }
    }

    return await this.propertyRepository.find({ where });
  }

  async getCurrentYearListingStats(): Promise<{ month: string; count: number }[]> {
    const year = new Date().getFullYear();
    
    const result = await this.propertyRepository.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00Z`),
            $lte: new Date(`${year}-12-31T23:59:59Z`)
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    // Fill missing months with zero
    const months = Array.from({ length: 12 }, (_, i) => {
      const month = (i + 1).toString().padStart(2, "0");
      const found = result.find((r: any) => r._id === `${year}-${month}`);
      return {
        month: `${year}-${month}`,
        count: found ? found.count : 0
      };
    });

    return months;
  }

  async getSubtypeAndTypePercentages(): Promise<any> {
    const total = await this.propertyRepository.count();

    if (total === 0) {
      return { message: 'Database is empty.' };
    }

    const daireCount = await this.propertyRepository.countDocuments({ subType: { $regex: "^Daire$", $options: "i" } });
    const villaCount = await this.propertyRepository.countDocuments({ subType: { $regex: "^Villa$", $options: "i" } });
    const dukkanCount = await this.propertyRepository.countDocuments({ subType: { $regex: "^Dükkan$", $options: "i" } });
    const arsaCount = await this.propertyRepository.countDocuments({ propertyType: { $regex: "^Arsa$", $options: "i" } });

    return [
      {
        name: "Daire",
        value: (daireCount / total) * 100,
        color: "#0088FE"
      },
      {
        name: "Villa",
        value: (villaCount / total) * 100,
        color: "#00C49F"
      },
      {
        name: "Dükkan",
        value: (dukkanCount / total) * 100,
        color: "#FFBB28"
      },
      {
        name: "Arsa",
        value: (arsaCount / total) * 100,
        color: "#FF8042"
      }
    ];
  }
}
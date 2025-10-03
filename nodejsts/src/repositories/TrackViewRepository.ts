import { MongoRepository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { TrackView } from '../entities/TrackView';
import { BaseRepository } from './BaseRepository';

export class TrackViewRepository extends BaseRepository<TrackView> {
  private trackViewRepository: MongoRepository<TrackView>;

  constructor() {
    super(TrackView);
    this.trackViewRepository = AppDataSource.getMongoRepository(TrackView);
  }

  async findByDate(date: string): Promise<TrackView | null> {
    return await this.trackViewRepository.findOne({ where: { date } });
  }

  async getCurrentYearStats(): Promise<{ month: string; views: number }[]> {
    const year = new Date().getFullYear();
    
    const result = await this.trackViewRepository.aggregate([
      {
        $match: {
          date: { $regex: `^${year}-` }
        }
      },
      {
        $group: {
          _id: { $substr: ["$date", 0, 7] },
          views: { $sum: "$views" },
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
        views: found ? found.views : 0
      };
    });

    return months;
  }

  async getCurrentMonthTotalViews(): Promise<number> {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const prefix = `${year}-${month}`;

    const result = await this.trackViewRepository.aggregate([
      {
        $match: {
          date: { $regex: `^${prefix}` }
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: "$views" }
        }
      }
    ]).toArray();

    return result.length > 0 ? result[0].totalViews : 0;
  }
}
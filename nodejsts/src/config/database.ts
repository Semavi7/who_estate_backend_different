import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Property } from '../entities/Property';
import { Message } from '../entities/Message';
import { TrackView } from '../entities/TrackView';
import { FeatureOption } from '../entities/FeatureOption';
import { ResetToken } from '../entities/ResetToken';
import { ClientIntake } from '../entities/ClientIntake';

export const AppDataSource = new DataSource({
  type: 'mongodb',
  url: process.env.MONGO_URL || 'mongodb://localhost:27017/who_estate',
  entities: [
    User,
    Property,
    Message,
    TrackView,
    FeatureOption,
    ResetToken,
    ClientIntake
  ],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  extra: {
    authSource: 'admin'
  }
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Database connection established');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
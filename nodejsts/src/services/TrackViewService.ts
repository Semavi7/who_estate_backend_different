import { TrackViewRepository } from '../repositories/TrackViewRepository';
import { TrackView } from '../entities/TrackView';

export class TrackViewService {
  private trackViewRepository: TrackViewRepository;

  constructor() {
    this.trackViewRepository = new TrackViewRepository();
  }

  async trackView(): Promise<TrackView> {
    const today = new Date().toISOString().split('T')[0] as string;
    
    let track = await this.trackViewRepository.findByDate(today);

    if (track) {
      track.views += 1;
      const updatedTrack = await this.trackViewRepository.update(track._id.toString(), { views: track.views });
      if (!updatedTrack) {
        throw new Error('Failed to update track view');
      }
      return updatedTrack;
    } else {
      const newTrack = await this.trackViewRepository.create({
        date: today,
        views: 1
      });
      return newTrack;
    }
  }

  async getCurrentYearStats(): Promise<{ month: string; views: number }[]> {
    return await this.trackViewRepository.getCurrentYearStats();
  }

  async getCurrentMonthTotalViews(): Promise<number> {
    return await this.trackViewRepository.getCurrentMonthTotalViews();
  }
}
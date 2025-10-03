using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using WhoEstate.API.Config;
using WhoEstate.API.Entities;

namespace WhoEstate.API.Services
{
    public class TrackViewService : ITrackViewService
    {
        private readonly IMongoCollection<TrackView> _trackViews;

        public TrackViewService(MongoDbContext context)
        {
            _trackViews = context.TrackViews;
        }

        public async Task<TrackView> CreateAsync()
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");

            var existingTrack = await _trackViews.Find(tv => tv.Date == today).FirstOrDefaultAsync();

            if (existingTrack != null)
            {
                existingTrack.Views += 1;
                await _trackViews.ReplaceOneAsync(tv => tv.Id == existingTrack.Id, existingTrack);
                return existingTrack;
            }
            else
            {
                var newTrack = new TrackView
                {
                    Date = today,
                    Views = 1
                };

                await _trackViews.InsertOneAsync(newTrack);
                return newTrack;
            }
        }

        public async Task<List<Dictionary<string, object>>> GetCurrentYearStatsAsync()
        {
            var year = DateTime.UtcNow.Year;
            var yearPrefix = $"{year}-";

            var result = await _trackViews.Aggregate()
                .Match(Builders<TrackView>.Filter.Regex(tv => tv.Date, new MongoDB.Bson.BsonRegularExpression($"^{yearPrefix}")))
                .Group(tv => tv.Date.Substring(0, 7), // Group by "YYYY-MM"
                    g => new { Month = g.Key, Views = g.Sum(x => x.Views) })
                .SortBy(x => x.Month)
                .ToListAsync();

            // Fill in missing months with 0 views
            var months = new List<Dictionary<string, object>>();
            for (int i = 1; i <= 12; i++)
            {
                var month = i.ToString().PadLeft(2, '0');
                var monthKey = $"{year}-{month}";
                
                var monthData = result.FirstOrDefault(r => r.Month == monthKey);
                
                months.Add(new Dictionary<string, object>
                {
                    { "month", monthKey },
                    { "views", monthData?.Views ?? 0 }
                });
            }

            return months;
        }

        public async Task<int> GetCurrentMonthTotalViewsAsync()
        {
            var now = DateTime.UtcNow;
            var year = now.Year;
            var month = now.Month.ToString().PadLeft(2, '0');
            var prefix = $"{year}-{month}";

            var result = await _trackViews.Aggregate()
                .Match(Builders<TrackView>.Filter.Regex(tv => tv.Date, new MongoDB.Bson.BsonRegularExpression($"^{prefix}")))
                .Group(_ => true, g => new { TotalViews = g.Sum(x => x.Views) })
                .FirstOrDefaultAsync();

            return result?.TotalViews ?? 0;
        }

        public async Task<List<TrackView>> GetAllAsync()
        {
            return await _trackViews.Find(_ => true).SortByDescending(tv => tv.Date).ToListAsync();
        }

        public async Task<TrackView> GetByDateAsync(string date)
        {
            return await _trackViews.Find(tv => tv.Date == date).FirstOrDefaultAsync();
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _trackViews.DeleteOneAsync(tv => tv.Id == id);
            return result.DeletedCount > 0;
        }
    }

    public interface ITrackViewService
    {
        Task<TrackView> CreateAsync();
        Task<List<Dictionary<string, object>>> GetCurrentYearStatsAsync();
        Task<int> GetCurrentMonthTotalViewsAsync();
        Task<List<TrackView>> GetAllAsync();
        Task<TrackView> GetByDateAsync(string date);
        Task<bool> DeleteAsync(string id);
    }
}
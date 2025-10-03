using Microsoft.Extensions.Options;
using MongoDB.Driver;
using WhoEstate.API.Entities;

namespace WhoEstate.API.Config
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoCollection<User> Users => _database.GetCollection<User>("users");
        public IMongoCollection<ResetToken> ResetTokens => _database.GetCollection<ResetToken>("resettokens");
        public IMongoCollection<Property> Properties => _database.GetCollection<Property>("properties");
        public IMongoCollection<Message> Messages => _database.GetCollection<Message>("messages");
        public IMongoCollection<TrackView> TrackViews => _database.GetCollection<TrackView>("trackviews");
        public IMongoCollection<ClientIntake> ClientIntakes => _database.GetCollection<ClientIntake>("clientintakes");
        public IMongoCollection<FeatureOption> FeatureOptions => _database.GetCollection<FeatureOption>("featureoptions");
    }

    public class MongoDbSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }
}
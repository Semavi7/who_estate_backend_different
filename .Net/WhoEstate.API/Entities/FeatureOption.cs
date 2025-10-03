using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WhoEstate.API.Entities
{
    public class FeatureOption
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("category")]
        public string Category { get; set; }

        [BsonElement("value")]
        public string Value { get; set; }
    }
}
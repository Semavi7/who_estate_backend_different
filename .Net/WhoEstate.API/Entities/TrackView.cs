using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WhoEstate.API.Entities
{
    public class TrackView
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("date")]
        public string Date { get; set; }

        [BsonElement("views")]
        public int Views { get; set; }
    }
}
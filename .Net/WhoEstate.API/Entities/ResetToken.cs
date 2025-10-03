using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace WhoEstate.API.Entities
{
    public class ResetToken
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("tokenHash")]
        public string TokenHash { get; set; }

        [BsonElement("userId")]
        public string UserId { get; set; }

        [BsonElement("expires")]
        public DateTime Expires { get; set; }

        [BsonElement("usedAt")]
        public DateTime? UsedAt { get; set; }
    }
}
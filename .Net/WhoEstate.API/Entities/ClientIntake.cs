using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace WhoEstate.API.Entities
{
    public class ClientIntake
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("namesurname")]
        public string NameSurname { get; set; }

        [BsonElement("phone")]
        public long Phone { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
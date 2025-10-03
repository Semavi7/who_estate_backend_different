using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace WhoEstate.API.Entities
{
    public class Message
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("surname")]
        public string Surname { get; set; }

        [BsonElement("email")]
        public string Email { get; set; }

        [BsonElement("phone")]
        public long Phone { get; set; }

        [BsonElement("message")]
        public string MessageText { get; set; }

        [BsonElement("isread")]
        public bool IsRead { get; set; } = false;

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
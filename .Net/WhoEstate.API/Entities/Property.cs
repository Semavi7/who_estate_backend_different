using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace WhoEstate.API.Entities
{
    public class GeoPoint
    {
        [BsonElement("type")]
        public string Type { get; set; } = "Point";

        [BsonElement("coordinates")]
        public double[] Coordinates { get; set; }
    }

    public class Location
    {
        [BsonElement("city")]
        public string City { get; set; }

        [BsonElement("district")]
        public string District { get; set; }

        [BsonElement("neighborhood")]
        public string Neighborhood { get; set; }

        [BsonElement("geo")]
        public GeoPoint Geo { get; set; }
    }

    public class Property
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("title")]
        public string Title { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }

        [BsonElement("price")]
        public double Price { get; set; }

        [BsonElement("gross")]
        public double Gross { get; set; }

        [BsonElement("net")]
        public double Net { get; set; }

        [BsonElement("numberOfRoom")]
        public string NumberOfRoom { get; set; }

        [BsonElement("buildingAge")]
        public int BuildingAge { get; set; }

        [BsonElement("floor")]
        public int Floor { get; set; }

        [BsonElement("numberOfFloors")]
        public int NumberOfFloors { get; set; }

        [BsonElement("heating")]
        public string Heating { get; set; }

        [BsonElement("numberOfBathrooms")]
        public int NumberOfBathrooms { get; set; }

        [BsonElement("kitchen")]
        public string Kitchen { get; set; }

        [BsonElement("balcony")]
        public int Balcony { get; set; }

        [BsonElement("lift")]
        public string Lift { get; set; }

        [BsonElement("parking")]
        public string Parking { get; set; }

        [BsonElement("furnished")]
        public string Furnished { get; set; }

        [BsonElement("availability")]
        public string Availability { get; set; }

        [BsonElement("dues")]
        public double Dues { get; set; }

        [BsonElement("eligibleForLoan")]
        public string EligibleForLoan { get; set; }

        [BsonElement("titleDeedStatus")]
        public string TitleDeedStatus { get; set; }

        [BsonElement("images")]
        public List<string> Images { get; set; } = new List<string>();

        [BsonElement("location")]
        public Location Location { get; set; }

        [BsonElement("userId")]
        public string UserId { get; set; }

        [BsonElement("propertyType")]
        public string PropertyType { get; set; }

        [BsonElement("listingType")]
        public string ListingType { get; set; }

        [BsonElement("subType")]
        public string SubType { get; set; }

        [BsonElement("selectedFeatures")]
        public Dictionary<string, List<string>> SelectedFeatures { get; set; } = new Dictionary<string, List<string>>();

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property (not stored in MongoDB)
        [BsonIgnore]
        public User User { get; set; }
    }
}
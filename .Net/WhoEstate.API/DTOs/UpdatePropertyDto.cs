using System.ComponentModel.DataAnnotations;

namespace WhoEstate.API.DTOs
{
    public class UpdatePropertyDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public double? Price { get; set; }
        public double? Gross { get; set; }
        public double? Net { get; set; }
        public string NumberOfRoom { get; set; }
        public int? BuildingAge { get; set; }
        public int? Floor { get; set; }
        public int? NumberOfFloors { get; set; }
        public string Heating { get; set; }
        public int? NumberOfBathrooms { get; set; }
        public string Kitchen { get; set; }
        public int? Balcony { get; set; }
        public string Lift { get; set; }
        public string Parking { get; set; }
        public string Furnished { get; set; }
        public string Availability { get; set; }
        public double? Dues { get; set; }
        public string EligibleForLoan { get; set; }
        public string TitleDeedStatus { get; set; }
        public string UserId { get; set; }
        public string Location { get; set; }
        public string PropertyType { get; set; }
        public string ListingType { get; set; }
        public string SubType { get; set; }
        public string SelectedFeatures { get; set; }
        public string ExistingImageUrls { get; set; }
    }
}
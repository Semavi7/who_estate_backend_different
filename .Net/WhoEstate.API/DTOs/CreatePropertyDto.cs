using System.ComponentModel.DataAnnotations;

namespace WhoEstate.API.DTOs
{
    public class CreatePropertyDto
    {
        [Required]
        public string Title { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public double Price { get; set; }

        [Required]
        public double Gross { get; set; }

        [Required]
        public double Net { get; set; }

        [Required]
        public string NumberOfRoom { get; set; }

        [Required]
        public int BuildingAge { get; set; }

        [Required]
        public int Floor { get; set; }

        [Required]
        public int NumberOfFloors { get; set; }

        [Required]
        public string Heating { get; set; }

        [Required]
        public int NumberOfBathrooms { get; set; }

        [Required]
        public string Kitchen { get; set; }

        [Required]
        public int Balcony { get; set; }

        [Required]
        public string Lift { get; set; }

        [Required]
        public string Parking { get; set; }

        [Required]
        public string Furnished { get; set; }

        [Required]
        public string Availability { get; set; }

        [Required]
        public double Dues { get; set; }

        [Required]
        public string EligibleForLoan { get; set; }

        [Required]
        public string TitleDeedStatus { get; set; }

        public string UserId { get; set; }

        [Required]
        public string Location { get; set; }

        [Required]
        public string PropertyType { get; set; }

        [Required]
        public string ListingType { get; set; }

        public string SubType { get; set; }

        public string SelectedFeatures { get; set; }
    }
}
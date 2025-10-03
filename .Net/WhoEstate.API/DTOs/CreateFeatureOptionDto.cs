using System.ComponentModel.DataAnnotations;

namespace WhoEstate.API.DTOs
{
    public class CreateFeatureOptionDto
    {
        [Required]
        public string Category { get; set; }

        [Required]
        public string Value { get; set; }
    }
}
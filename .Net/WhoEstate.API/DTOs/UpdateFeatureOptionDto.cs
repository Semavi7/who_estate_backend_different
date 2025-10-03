using System.ComponentModel.DataAnnotations;

namespace WhoEstate.API.DTOs
{
    public class UpdateFeatureOptionDto
    {
        public string Category { get; set; }
        public string Value { get; set; }
    }
}
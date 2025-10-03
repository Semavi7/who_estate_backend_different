using System.ComponentModel.DataAnnotations;

namespace WhoEstate.API.DTOs
{
    public class CreateClientIntakeDto
    {
        [Required]
        public string NameSurname { get; set; }

        [Required]
        public long Phone { get; set; }

        [Required]
        public string Description { get; set; }
    }
}
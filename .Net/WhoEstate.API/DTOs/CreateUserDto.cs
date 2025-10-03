using System.ComponentModel.DataAnnotations;

namespace WhoEstate.API.DTOs
{
    public class CreateUserDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        public long PhoneNumber { get; set; }
    }
}
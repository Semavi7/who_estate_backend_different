using System.ComponentModel.DataAnnotations;

namespace WhoEstate.API.DTOs
{
    public class CreateMessageDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Surname { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public long Phone { get; set; }

        [Required]
        public string Message { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace WhoEstate.API.DTOs
{
    public class UpdateUserDto
    {
        [EmailAddress]
        public string Email { get; set; }

        public string Name { get; set; }

        public string Surname { get; set; }

        public long? PhoneNumber { get; set; }

        public string Image { get; set; }
    }
}
using System.ComponentModel.DataAnnotations;

namespace WhoEstate.API.DTOs
{
    public class UpdateClientIntakeDto
    {
        public string NameSurname { get; set; }
        public long? Phone { get; set; }
        public string Description { get; set; }
    }
}
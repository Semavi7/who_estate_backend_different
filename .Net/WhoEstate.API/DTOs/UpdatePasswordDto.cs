using System.ComponentModel.DataAnnotations;

namespace WhoEstate.API.DTOs
{
    public class UpdatePasswordDto
    {
        [Required]
        public string OldPassword { get; set; }

        [Required]
        [MinLength(6, ErrorMessage = "Yeni şifre en az 6 karakter olmalı")]
        public string NewPassword { get; set; }
    }
}
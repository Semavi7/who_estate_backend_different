namespace WhoEstate.API.DTOs
{
    public class LoginResponseDto
    {
        public string AccessToken { get; set; }
        public string Email { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public long PhoneNumber { get; set; }
        public string Role { get; set; }
        public string Image { get; set; }
    }
}
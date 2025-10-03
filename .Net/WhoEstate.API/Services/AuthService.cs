using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using WhoEstate.API.Config;
using WhoEstate.API.DTOs;
using WhoEstate.API.Entities;
using WhoEstate.API.Enums;

namespace WhoEstate.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserService _userService;
        private readonly IMongoCollection<ResetToken> _resetTokens;
        private readonly IConfiguration _configuration;
        private readonly IMailerService _mailerService;

        public AuthService(
            IUserService userService,
            MongoDbContext context,
            IConfiguration configuration,
            IMailerService mailerService)
        {
            _userService = userService;
            _resetTokens = context.ResetTokens;
            _configuration = configuration;
            _mailerService = mailerService;
        }

        public async Task<LoginResponseDto> LoginAsync(string email, string password)
        {
            var user = await _userService.FindOneByEmailAsync(email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
                return null;

            var token = GenerateJwtToken(user);
            
            return new LoginResponseDto
            {
                AccessToken = token,
                Email = user.Email,
                Id = user.Id,
                Name = user.Name,
                Surname = user.Surname,
                PhoneNumber = user.PhoneNumber,
                Role = user.Roles,
                Image = user.Image
            };
        }

        public async Task<string> ForgotPasswordAsync(string email)
        {
            var user = await _userService.FindOneByEmailAsync(email);
            if (user == null)
                return "Eğer bu e-posta sistemimizde kayıtlı ise, şifre sıfırlama bağlantısı gönderildi.";

            var plainToken = GenerateRandomToken();
            var tokenHash = HashToken(plainToken);
            var expires = DateTime.UtcNow.AddMinutes(15);

            await _resetTokens.DeleteManyAsync(rt => rt.UserId == user.Id);
            
            var resetToken = new ResetToken
            {
                TokenHash = tokenHash,
                UserId = user.Id,
                Expires = expires
            };

            await _resetTokens.InsertOneAsync(resetToken);

            var resetUrl = $"http://localhost:3000/reset-password?token={plainToken}";
            await _mailerService.SendResetPasswordMailAsync(user.Email, resetUrl);

            return "Eğer bu e-posta sistemimizde kayıtlı ise, şifre sıfırlama bağlantısı gönderildi.";
        }

        public async Task<string> ResetPasswordAsync(string plainToken, string newPassword)
        {
            var tokenHash = HashToken(plainToken);
            var record = await _resetTokens.Find(rt => rt.TokenHash == tokenHash).FirstOrDefaultAsync();

            if (record == null)
                throw new Exception("Token geçersiz");

            if (record.Expires < DateTime.UtcNow)
                throw new Exception("Token Süresi Dolmuş");

            var user = await _userService.FindOneAsync(record.UserId);
            if (user == null)
                throw new Exception("Kullanıcı bulunamadı");

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _userService.UpdateAsync(user.Id, new UpdateUserDto
            {
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                PhoneNumber = user.PhoneNumber,
                Image = user.Image
            });

            await _resetTokens.DeleteOneAsync(rt => rt.Id == record.Id);

            return "Şifre başarıyla güncellendi";
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Secret"]);

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Role, user.Roles)
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private string GenerateRandomToken()
        {
            var randomBytes = new byte[32];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        private string HashToken(string plainToken)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(plainToken);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }
    }

    public interface IAuthService
    {
        Task<LoginResponseDto> LoginAsync(string email, string password);
        Task<string> ForgotPasswordAsync(string email);
        Task<string> ResetPasswordAsync(string plainToken, string newPassword);
    }
}
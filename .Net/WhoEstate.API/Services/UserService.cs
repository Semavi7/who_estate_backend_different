using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using WhoEstate.API.Config;
using WhoEstate.API.DTOs;
using WhoEstate.API.Entities;
using WhoEstate.API.Enums;
using BCrypt.Net;

namespace WhoEstate.API.Services
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _users;
        private readonly ILogger<UserService> _logger;
        private readonly IMailerService _mailerService;

        public UserService(MongoDbContext context, ILogger<UserService> logger, IMailerService mailerService)
        {
            _users = context.Users;
            _logger = logger;
            _mailerService = mailerService;
        }

        public async Task InitializeAdminUserAsync()
        {
            const string adminEmail = "refiyederya@gmail.com";
            var adminExists = await _users.Find(u => u.Email == adminEmail).AnyAsync();

            if (!adminExists)
            {
                var hashedPassword = BCrypt.Net.BCrypt.HashPassword("123456");
                var adminUser = new User
                {
                    Email = adminEmail,
                    Password = hashedPassword,
                    Name = "Refiye Derya",
                    Surname = "Gürses",
                    PhoneNumber = 5368100880,
                    Roles = Role.Admin.ToString(),
                    CreatedAt = DateTime.UtcNow
                };

                await _users.InsertOneAsync(adminUser);
                _logger.LogInformation("Admin user created successfully");
            }
        }

        public async Task<User> CreateAsync(CreateUserDto createUserDto)
        {
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword("123456");
            var newUser = new User
            {
                Email = createUserDto.Email,
                Password = hashedPassword,
                Name = createUserDto.Name,
                Surname = createUserDto.Surname,
                PhoneNumber = createUserDto.PhoneNumber,
                Roles = Role.Member.ToString(),
                CreatedAt = DateTime.UtcNow
            };

            await _users.InsertOneAsync(newUser);
            
            // Send welcome email (fire and forget)
            _ = Task.Run(async () =>
            {
                try
                {
                    await _mailerService.SendWelcomeMailAsync(newUser.Email, $"{newUser.Name} {newUser.Surname}");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Hoş geldin maili gönderilirken hata oluştu");
                }
            });

            return newUser;
        }

        public async Task<User> FindOneByEmailAsync(string email)
        {
            return await _users.Find(u => u.Email == email).FirstOrDefaultAsync();
        }

        public async Task<User> FindOneAsync(string id)
        {
            return await _users.Find(u => u.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<User>> FindAllAsync()
        {
            return await _users.Find(_ => true).ToListAsync();
        }

        public async Task<User> UpdateAsync(string id, UpdateUserDto updateUserDto)
        {
            var user = await FindOneAsync(id);
            if (user == null)
                throw new Exception("Kullanıcı Bulunamadı");

            if (!string.IsNullOrEmpty(updateUserDto.Email))
                user.Email = updateUserDto.Email;
            if (!string.IsNullOrEmpty(updateUserDto.Name))
                user.Name = updateUserDto.Name;
            if (!string.IsNullOrEmpty(updateUserDto.Surname))
                user.Surname = updateUserDto.Surname;
            if (updateUserDto.PhoneNumber.HasValue)
                user.PhoneNumber = updateUserDto.PhoneNumber.Value;
            if (!string.IsNullOrEmpty(updateUserDto.Image))
                user.Image = updateUserDto.Image;

            await _users.ReplaceOneAsync(u => u.Id == id, user);
            return user;
        }

        public async Task<bool> UpdatePasswordAsync(string id, string oldPassword, string newPassword)
        {
            var user = await FindOneAsync(id);
            if (user == null || !BCrypt.Net.BCrypt.Verify(oldPassword, user.Password))
                return false;

            user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _users.ReplaceOneAsync(u => u.Id == id, user);
            return true;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _users.DeleteOneAsync(u => u.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<bool> ValidateUserAsync(string email, string password)
        {
            var user = await FindOneByEmailAsync(email);
            return user != null && BCrypt.Net.BCrypt.Verify(password, user.Password);
        }
    }

    public interface IUserService
    {
        Task InitializeAdminUserAsync();
        Task<User> CreateAsync(CreateUserDto createUserDto);
        Task<User> FindOneByEmailAsync(string email);
        Task<User> FindOneAsync(string id);
        Task<List<User>> FindAllAsync();
        Task<User> UpdateAsync(string id, UpdateUserDto updateUserDto);
        Task<bool> UpdatePasswordAsync(string id, string oldPassword, string newPassword);
        Task<bool> DeleteAsync(string id);
        Task<bool> ValidateUserAsync(string email, string password);
    }
}
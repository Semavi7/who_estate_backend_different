using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using WhoEstate.API.Config;
using WhoEstate.API.DTOs;
using WhoEstate.API.Entities;

namespace WhoEstate.API.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMongoCollection<Message> _messages;

        public MessageService(MongoDbContext context)
        {
            _messages = context.Messages;
        }

        public async Task<Message> CreateAsync(CreateMessageDto createDto)
        {
            var newMessage = new Message
            {
                Name = createDto.Name,
                Surname = createDto.Surname,
                Email = createDto.Email,
                Phone = createDto.Phone,
                MessageText = createDto.Message,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            await _messages.InsertOneAsync(newMessage);
            return newMessage;
        }

        public async Task<List<Message>> FindAllAsync()
        {
            return await _messages.Find(_ => true).ToListAsync();
        }

        public async Task<Message> FindOneAsync(string id)
        {
            return await _messages.Find(m => m.Id == id).FirstOrDefaultAsync();
        }

        public async Task<Message> MarkAsReadAsync(string id)
        {
            var message = await FindOneAsync(id);
            if (message == null)
                throw new Exception("Mesaj Bulunamadı");

            message.IsRead = true;
            await _messages.ReplaceOneAsync(m => m.Id == id, message);
            return message;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _messages.DeleteOneAsync(m => m.Id == id);
            return result.DeletedCount > 0;
        }
    }

    public interface IMessageService
    {
        Task<Message> CreateAsync(CreateMessageDto createDto);
        Task<List<Message>> FindAllAsync();
        Task<Message> FindOneAsync(string id);
        Task<Message> MarkAsReadAsync(string id);
        Task<bool> DeleteAsync(string id);
    }
}
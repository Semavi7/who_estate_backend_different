using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MongoDB.Driver;
using WhoEstate.API.Config;
using WhoEstate.API.DTOs;
using WhoEstate.API.Entities;

namespace WhoEstate.API.Services
{
    public class ClientIntakeService : IClientIntakeService
    {
        private readonly IMongoCollection<ClientIntake> _clientIntakes;

        public ClientIntakeService(MongoDbContext context)
        {
            _clientIntakes = context.ClientIntakes;
        }

        public async Task<ClientIntake> CreateAsync(CreateClientIntakeDto createDto)
        {
            var newClientIntake = new ClientIntake
            {
                NameSurname = createDto.NameSurname,
                Phone = createDto.Phone,
                Description = createDto.Description,
                CreatedAt = DateTime.UtcNow
            };

            await _clientIntakes.InsertOneAsync(newClientIntake);
            return newClientIntake;
        }

        public async Task<List<ClientIntake>> FindAllAsync()
        {
            return await _clientIntakes.Find(_ => true).ToListAsync();
        }

        public async Task<ClientIntake> FindOneAsync(string id)
        {
            return await _clientIntakes.Find(ci => ci.Id == id).FirstOrDefaultAsync();
        }

        public async Task<ClientIntake> UpdateAsync(string id, UpdateClientIntakeDto updateDto)
        {
            var clientIntake = await FindOneAsync(id);
            if (clientIntake == null)
                throw new Exception("Kayıt Bulunamadı");

            if (!string.IsNullOrEmpty(updateDto.NameSurname))
                clientIntake.NameSurname = updateDto.NameSurname;
            if (updateDto.Phone.HasValue)
                clientIntake.Phone = updateDto.Phone.Value;
            if (!string.IsNullOrEmpty(updateDto.Description))
                clientIntake.Description = updateDto.Description;

            await _clientIntakes.ReplaceOneAsync(ci => ci.Id == id, clientIntake);
            return clientIntake;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _clientIntakes.DeleteOneAsync(ci => ci.Id == id);
            return result.DeletedCount > 0;
        }
    }

    public interface IClientIntakeService
    {
        Task<ClientIntake> CreateAsync(CreateClientIntakeDto createDto);
        Task<List<ClientIntake>> FindAllAsync();
        Task<ClientIntake> FindOneAsync(string id);
        Task<ClientIntake> UpdateAsync(string id, UpdateClientIntakeDto updateDto);
        Task<bool> DeleteAsync(string id);
    }
}
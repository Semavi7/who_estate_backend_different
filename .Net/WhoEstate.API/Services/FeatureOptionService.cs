using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using WhoEstate.API.Config;
using WhoEstate.API.DTOs;
using WhoEstate.API.Entities;

namespace WhoEstate.API.Services
{
    public class FeatureOptionService : IFeatureOptionService
    {
        private readonly IMongoCollection<FeatureOption> _featureOptions;

        public FeatureOptionService(MongoDbContext context)
        {
            _featureOptions = context.FeatureOptions;
        }

        public async Task<FeatureOption> CreateAsync(CreateFeatureOptionDto createDto)
        {
            // Check for duplicate
            var existing = await _featureOptions.Find(fo => 
                fo.Category == createDto.Category && fo.Value == createDto.Value).FirstOrDefaultAsync();
            
            if (existing != null)
                throw new Exception("Bu özellik zaten mevcut.");

            var newOption = new FeatureOption
            {
                Category = createDto.Category,
                Value = createDto.Value
            };

            await _featureOptions.InsertOneAsync(newOption);
            return newOption;
        }

        public async Task<List<FeatureOption>> FindAllAsync()
        {
            return await _featureOptions.Find(_ => true).ToListAsync();
        }

        public async Task<Dictionary<string, List<string>>> FindAllGroupedAsync()
        {
            var allOptions = await FindAllAsync();
            return allOptions.GroupBy(fo => fo.Category)
                .ToDictionary(g => g.Key, g => g.Select(fo => fo.Value).ToList());
        }

        public async Task<FeatureOption> FindOneAsync(string id)
        {
            return await _featureOptions.Find(fo => fo.Id == id).FirstOrDefaultAsync();
        }

        public async Task<FeatureOption> UpdateAsync(string id, UpdateFeatureOptionDto updateDto)
        {
            var existingOption = await FindOneAsync(id);
            if (existingOption == null)
                throw new Exception("Özellik bulunamadı");

            // Check for potential duplicate with other records
            if (!string.IsNullOrEmpty(updateDto.Category) || !string.IsNullOrEmpty(updateDto.Value))
            {
                var category = updateDto.Category ?? existingOption.Category;
                var value = updateDto.Value ?? existingOption.Value;

                var potentialDuplicate = await _featureOptions.Find(fo => 
                    fo.Category == category && fo.Value == value && fo.Id != id).FirstOrDefaultAsync();

                if (potentialDuplicate != null)
                    throw new Exception("Güncelleme sonucunda başka bir özellikle aynı olacak. Lütfen farklı bir değer girin.");
            }

            if (!string.IsNullOrEmpty(updateDto.Category))
                existingOption.Category = updateDto.Category;
            if (!string.IsNullOrEmpty(updateDto.Value))
                existingOption.Value = updateDto.Value;

            await _featureOptions.ReplaceOneAsync(fo => fo.Id == id, existingOption);
            return existingOption;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _featureOptions.DeleteOneAsync(fo => fo.Id == id);
            return result.DeletedCount > 0;
        }
    }

    public interface IFeatureOptionService
    {
        Task<FeatureOption> CreateAsync(CreateFeatureOptionDto createDto);
        Task<List<FeatureOption>> FindAllAsync();
        Task<Dictionary<string, List<string>>> FindAllGroupedAsync();
        Task<FeatureOption> FindOneAsync(string id);
        Task<FeatureOption> UpdateAsync(string id, UpdateFeatureOptionDto updateDto);
        Task<bool> DeleteAsync(string id);
    }
}
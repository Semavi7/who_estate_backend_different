using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Driver;
using WhoEstate.API.Config;
using WhoEstate.API.DTOs;
using WhoEstate.API.Entities;

namespace WhoEstate.API.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IMongoCollection<Property> _properties;
        private readonly IUserService _userService;
        private readonly ILogger<PropertyService> _logger;

        public PropertyService(MongoDbContext context, IUserService userService, ILogger<PropertyService> logger)
        {
            _properties = context.Properties;
            _userService = userService;
            _logger = logger;
        }

        public async Task InitializeIndexesAsync()
        {
            try
            {
                var indexKeys = Builders<Property>.IndexKeys.Geo2DSphere("location.geo");
                await _properties.Indexes.CreateOneAsync(new CreateIndexModel<Property>(indexKeys));
                _logger.LogInformation("Geo-spatial index created successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to create geo-spatial index");
            }
        }

        public async Task<Property> CreateAsync(CreatePropertyDto createDto, List<string> imageUrls)
        {
            var locationData = System.Text.Json.JsonSerializer.Deserialize<Location>(createDto.Location);
            var selectedFeaturesData = !string.IsNullOrEmpty(createDto.SelectedFeatures) 
                ? System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, List<string>>>(createDto.SelectedFeatures)
                : new Dictionary<string, List<string>>();

            var newProperty = new Property
            {
                Title = createDto.Title,
                Description = createDto.Description,
                Price = createDto.Price,
                Gross = createDto.Gross,
                Net = createDto.Net,
                NumberOfRoom = createDto.NumberOfRoom,
                BuildingAge = createDto.BuildingAge,
                Floor = createDto.Floor,
                NumberOfFloors = createDto.NumberOfFloors,
                Heating = createDto.Heating,
                NumberOfBathrooms = createDto.NumberOfBathrooms,
                Kitchen = createDto.Kitchen,
                Balcony = createDto.Balcony,
                Lift = createDto.Lift,
                Parking = createDto.Parking,
                Furnished = createDto.Furnished,
                Availability = createDto.Availability,
                Dues = createDto.Dues,
                EligibleForLoan = createDto.EligibleForLoan,
                TitleDeedStatus = createDto.TitleDeedStatus,
                Images = imageUrls,
                Location = locationData,
                PropertyType = createDto.PropertyType,
                ListingType = createDto.ListingType,
                SubType = createDto.SubType,
                SelectedFeatures = selectedFeaturesData,
                UserId = createDto.UserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _properties.InsertOneAsync(newProperty);
            return newProperty;
        }

        public async Task<List<Property>> FindAllAsync()
        {
            var properties = await _properties.Find(_ => true).ToListAsync();
            return await EnrichPropertiesWithUsersAsync(properties);
        }

        public async Task<List<Property>> QueryAsync(Dictionary<string, object> queryParams)
        {
            var filterBuilder = Builders<Property>.Filter;
            var filter = filterBuilder.Empty;

            foreach (var param in queryParams)
            {
                if (param.Value == null) continue;

                if (param.Key == "city" || param.Key == "district" || param.Key == "neighborhood")
                {
                    filter &= filterBuilder.Eq($"location.{param.Key}", param.Value.ToString());
                }
                else if (param.Key.StartsWith("min"))
                {
                    var field = param.Key.Substring(3).ToLower();
                    if (double.TryParse(param.Value.ToString(), out var minValue))
                    {
                        filter &= filterBuilder.Gte(field, minValue);
                    }
                }
                else if (param.Key.StartsWith("max"))
                {
                    var field = param.Key.Substring(3).ToLower();
                    if (double.TryParse(param.Value.ToString(), out var maxValue))
                    {
                        filter &= filterBuilder.Lte(field, maxValue);
                    }
                }
                else
                {
                    filter &= filterBuilder.Eq(param.Key, param.Value);
                }
            }

            var properties = await _properties.Find(filter).ToListAsync();
            return await EnrichPropertiesWithUsersAsync(properties);
        }

        public async Task<Property> FindOneAsync(string id)
        {
            var property = await _properties.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (property == null) return null;

            return await EnrichPropertyWithUserAsync(property);
        }

        public async Task<Property> UpdateAsync(string id, UpdatePropertyDto updateDto, List<string> newImageUrls)
        {
            var existingProperty = await _properties.Find(p => p.Id == id).FirstOrDefaultAsync();
            if (existingProperty == null)
                throw new Exception("Bu ıd ye ait kayıt bulunamadı");

            var keptImageUrls = !string.IsNullOrEmpty(updateDto.ExistingImageUrls)
                ? System.Text.Json.JsonSerializer.Deserialize<List<string>>(updateDto.ExistingImageUrls)
                : new List<string>();

            existingProperty.Images = keptImageUrls.Concat(newImageUrls).ToList();

            // Update other properties
            if (!string.IsNullOrEmpty(updateDto.Title)) existingProperty.Title = updateDto.Title;
            if (!string.IsNullOrEmpty(updateDto.Description)) existingProperty.Description = updateDto.Description;
            if (updateDto.Price.HasValue) existingProperty.Price = updateDto.Price.Value;
            if (updateDto.Gross.HasValue) existingProperty.Gross = updateDto.Gross.Value;
            if (updateDto.Net.HasValue) existingProperty.Net = updateDto.Net.Value;
            if (!string.IsNullOrEmpty(updateDto.NumberOfRoom)) existingProperty.NumberOfRoom = updateDto.NumberOfRoom;
            if (updateDto.BuildingAge.HasValue) existingProperty.BuildingAge = updateDto.BuildingAge.Value;
            if (updateDto.Floor.HasValue) existingProperty.Floor = updateDto.Floor.Value;
            if (updateDto.NumberOfFloors.HasValue) existingProperty.NumberOfFloors = updateDto.NumberOfFloors.Value;
            if (!string.IsNullOrEmpty(updateDto.Heating)) existingProperty.Heating = updateDto.Heating;
            if (updateDto.NumberOfBathrooms.HasValue) existingProperty.NumberOfBathrooms = updateDto.NumberOfBathrooms.Value;
            if (!string.IsNullOrEmpty(updateDto.Kitchen)) existingProperty.Kitchen = updateDto.Kitchen;
            if (updateDto.Balcony.HasValue) existingProperty.Balcony = updateDto.Balcony.Value;
            if (!string.IsNullOrEmpty(updateDto.Lift)) existingProperty.Lift = updateDto.Lift;
            if (!string.IsNullOrEmpty(updateDto.Parking)) existingProperty.Parking = updateDto.Parking;
            if (!string.IsNullOrEmpty(updateDto.Furnished)) existingProperty.Furnished = updateDto.Furnished;
            if (!string.IsNullOrEmpty(updateDto.Availability)) existingProperty.Availability = updateDto.Availability;
            if (updateDto.Dues.HasValue) existingProperty.Dues = updateDto.Dues.Value;
            if (!string.IsNullOrEmpty(updateDto.EligibleForLoan)) existingProperty.EligibleForLoan = updateDto.EligibleForLoan;
            if (!string.IsNullOrEmpty(updateDto.TitleDeedStatus)) existingProperty.TitleDeedStatus = updateDto.TitleDeedStatus;
            if (!string.IsNullOrEmpty(updateDto.UserId)) existingProperty.UserId = updateDto.UserId;
            if (!string.IsNullOrEmpty(updateDto.PropertyType)) existingProperty.PropertyType = updateDto.PropertyType;
            if (!string.IsNullOrEmpty(updateDto.ListingType)) existingProperty.ListingType = updateDto.ListingType;
            if (!string.IsNullOrEmpty(updateDto.SubType)) existingProperty.SubType = updateDto.SubType;

            if (!string.IsNullOrEmpty(updateDto.Location))
                existingProperty.Location = System.Text.Json.JsonSerializer.Deserialize<Location>(updateDto.Location);

            if (!string.IsNullOrEmpty(updateDto.SelectedFeatures))
                existingProperty.SelectedFeatures = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, List<string>>>(updateDto.SelectedFeatures);

            existingProperty.UpdatedAt = DateTime.UtcNow;

            await _properties.ReplaceOneAsync(p => p.Id == id, existingProperty);
            return await EnrichPropertyWithUserAsync(existingProperty);
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var result = await _properties.DeleteOneAsync(p => p.Id == id);
            return result.DeletedCount > 0;
        }

        public async Task<List<Property>> FindNearAsync(double longitude, double latitude, double distance)
        {
            var point = new GeoPoint { Coordinates = new[] { longitude, latitude } };
            var filter = Builders<Property>.Filter.NearSphere(p => p.Location.Geo, point.Coordinates[0], point.Coordinates[1], distance);

            var properties = await _properties.Find(filter).ToListAsync();
            return await EnrichPropertiesWithUsersAsync(properties);
        }

        public async Task<List<Property>> FindLastSixAsync()
        {
            var properties = await _properties.Find(_ => true)
                .SortByDescending(p => p.CreatedAt)
                .Limit(6)
                .ToListAsync();

            return await EnrichPropertiesWithUsersAsync(properties);
        }

        public async Task<int> CountAllAsync()
        {
            return (int)await _properties.CountDocumentsAsync(_ => true);
        }

        private async Task<Property> EnrichPropertyWithUserAsync(Property property)
        {
            if (!string.IsNullOrEmpty(property.UserId))
            {
                try
                {
                    var user = await _userService.FindOneAsync(property.UserId);
                    property.User = user; // Note: We'll need to add a User property to the Property entity
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "User not found for property {PropertyId}", property.Id);
                }
            }
            return property;
        }

        private async Task<List<Property>> EnrichPropertiesWithUsersAsync(List<Property> properties)
        {
            foreach (var property in properties)
            {
                await EnrichPropertyWithUserAsync(property);
            }
            return properties;
        }
    }

    public interface IPropertyService
    {
        Task InitializeIndexesAsync();
        Task<Property> CreateAsync(CreatePropertyDto createDto, List<string> imageUrls);
        Task<List<Property>> FindAllAsync();
        Task<List<Property>> QueryAsync(Dictionary<string, object> queryParams);
        Task<Property> FindOneAsync(string id);
        Task<Property> UpdateAsync(string id, UpdatePropertyDto updateDto, List<string> newImageUrls);
        Task<bool> DeleteAsync(string id);
        Task<List<Property>> FindNearAsync(double longitude, double latitude, double distance);
        Task<List<Property>> FindLastSixAsync();
        Task<int> CountAllAsync();
    }
}
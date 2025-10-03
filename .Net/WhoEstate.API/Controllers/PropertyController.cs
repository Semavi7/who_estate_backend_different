using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WhoEstate.API.DTOs;
using WhoEstate.API.Services;
using Microsoft.AspNetCore.Http;

namespace WhoEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PropertyController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly IFileUploadService _fileUploadService;

        public PropertyController(IPropertyService propertyService, IFileUploadService fileUploadService)
        {
            _propertyService = propertyService;
            _fileUploadService = fileUploadService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllProperties()
        {
            try
            {
                var properties = await _propertyService.FindAllAsync();
                return Ok(properties);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProperty(string id)
        {
            try
            {
                var property = await _propertyService.FindOneAsync(id);
                if (property == null)
                    return NotFound(new { message = "İlan bulunamadı" });

                return Ok(property);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Agent")]
        public async Task<IActionResult> CreateProperty([FromForm] CreatePropertyDto createPropertyDto, [FromForm] List<IFormFile> images)
        {
            try
            {
                var imageUrls = new List<string>();
                
                if (images != null && images.Count > 0)
                {
                    foreach (var image in images)
                    {
                        var imageUrl = await _fileUploadService.UploadFileAsync(image, true);
                        imageUrls.Add(imageUrl);
                    }
                }

                var property = await _propertyService.CreateAsync(createPropertyDto, imageUrls);
                return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Agent")]
        public async Task<IActionResult> UpdateProperty(string id, [FromForm] UpdatePropertyDto updatePropertyDto, [FromForm] List<IFormFile> newImages)
        {
            try
            {
                var newImageUrls = new List<string>();
                
                if (newImages != null && newImages.Count > 0)
                {
                    foreach (var image in newImages)
                    {
                        var imageUrl = await _fileUploadService.UploadFileAsync(image, true);
                        newImageUrls.Add(imageUrl);
                    }
                }

                var property = await _propertyService.UpdateAsync(id, updatePropertyDto, newImageUrls);
                return Ok(property);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Agent")]
        public async Task<IActionResult> DeleteProperty(string id)
        {
            try
            {
                var success = await _propertyService.DeleteAsync(id);
                if (!success)
                    return NotFound(new { message = "İlan bulunamadı" });

                return Ok(new { message = "İlan başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserProperties(string userId)
        {
            try
            {
                // Use QueryAsync to filter by user ID
                var queryParams = new Dictionary<string, object> { { "userId", userId } };
                var properties = await _propertyService.QueryAsync(queryParams);
                return Ok(properties);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchProperties(
            [FromQuery] string query,
            [FromQuery] string category = null,
            [FromQuery] string type = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null)
        {
            try
            {
                // Use QueryAsync with appropriate parameters
                var queryParams = new Dictionary<string, object>();
                
                if (!string.IsNullOrEmpty(category))
                    queryParams["category"] = category;
                if (!string.IsNullOrEmpty(type))
                    queryParams["type"] = type;
                if (minPrice.HasValue)
                    queryParams["minPrice"] = minPrice.Value;
                if (maxPrice.HasValue)
                    queryParams["maxPrice"] = maxPrice.Value;

                var properties = await _propertyService.QueryAsync(queryParams);
                return Ok(properties);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
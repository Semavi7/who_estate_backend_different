using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace WhoEstate.API.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<FileUploadService> _logger;

        public FileUploadService(IConfiguration configuration, ILogger<FileUploadService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<string> UploadFileAsync(IFormFile file, bool addWatermark = false)
        {
            try
            {
                // For now, we'll save files locally. In production, this should be replaced with cloud storage
                var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
                if (!Directory.Exists(uploadsPath))
                {
                    Directory.CreateDirectory(uploadsPath);
                }

                var uniqueFileName = $"{Guid.NewGuid()}-{file.FileName.Replace(" ", "_")}";
                var filePath = Path.Combine(uploadsPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                var publicUrl = $"/uploads/{uniqueFileName}";
                _logger.LogInformation($"Dosya başarı ile yüklendi: {publicUrl}");
                
                return publicUrl;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Dosya yüklenirken hata oluştu");
                throw new Exception($"Dosya yüklenemedi: {ex.Message}");
            }
        }

        public async Task<bool> DeleteFileAsync(string fileUrl)
        {
            try
            {
                if (fileUrl.StartsWith("/uploads/"))
                {
                    var fileName = fileUrl.Substring("/uploads/".Length);
                    var filePath = Path.Combine(Directory.GetCurrentDirectory(), "uploads", fileName);
                    
                    if (File.Exists(filePath))
                    {
                        File.Delete(filePath);
                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Dosya silinirken hata oluştu");
                return false;
            }
        }
    }

    public interface IFileUploadService
    {
        Task<string> UploadFileAsync(IFormFile file, bool addWatermark = false);
        Task<bool> DeleteFileAsync(string fileUrl);
    }
}
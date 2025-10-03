using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using WhoEstate.API.Services;

namespace WhoEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FileUploadController : ControllerBase
    {
        private readonly IFileUploadService _fileUploadService;

        public FileUploadController(IFileUploadService fileUploadService)
        {
            _fileUploadService = fileUploadService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file, [FromQuery] bool addWatermark = false)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { message = "Dosya seçilmedi" });

                var fileUrl = await _fileUploadService.UploadFileAsync(file, addWatermark);
                return Ok(new { url = fileUrl });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("upload-multiple")]
        public async Task<IActionResult> UploadFiles(List<IFormFile> files, [FromQuery] bool addWatermark = false)
        {
            try
            {
                if (files == null || files.Count == 0)
                    return BadRequest(new { message = "Dosya seçilmedi" });

                var fileUrls = new List<string>();
                foreach (var file in files)
                {
                    if (file.Length > 0)
                    {
                        var fileUrl = await _fileUploadService.UploadFileAsync(file, addWatermark);
                        fileUrls.Add(fileUrl);
                    }
                }

                return Ok(new { urls = fileUrls });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFile([FromQuery] string fileUrl)
        {
            try
            {
                var success = await _fileUploadService.DeleteFileAsync(fileUrl);
                if (!success)
                    return NotFound(new { message = "Dosya bulunamadı" });

                return Ok(new { message = "Dosya başarıyla silindi" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
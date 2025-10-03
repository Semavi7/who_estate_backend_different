using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WhoEstate.API.Services;

namespace WhoEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class TrackViewController : ControllerBase
    {
        private readonly ITrackViewService _trackViewService;

        public TrackViewController(ITrackViewService trackViewService)
        {
            _trackViewService = trackViewService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> TrackView()
        {
            try
            {
                var trackView = await _trackViewService.CreateAsync();
                return Ok(trackView);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("stats/year")]
        public async Task<IActionResult> GetYearlyStats()
        {
            try
            {
                var stats = await _trackViewService.GetCurrentYearStatsAsync();
                return Ok(stats);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("stats/month")]
        public async Task<IActionResult> GetMonthlyStats()
        {
            try
            {
                var totalViews = await _trackViewService.GetCurrentMonthTotalViewsAsync();
                return Ok(new { totalViews });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTrackViews()
        {
            try
            {
                var trackViews = await _trackViewService.GetAllAsync();
                return Ok(trackViews);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
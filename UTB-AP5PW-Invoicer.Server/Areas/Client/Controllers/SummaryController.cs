using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Extensions;
using UTB_AP5PW_Invoicer.Server.Areas.Client.ViewModels;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers
{
    [ApiController]
    [Area("Client")]
    [Route("[area]/[controller]")]
    public class SummaryController : ControllerBase
    {
        private readonly ISummaryService _summaryService;
        private readonly IMapper _mapper;

        public SummaryController(ISummaryService summaryService, IMapper mapper)
        {
            _summaryService = summaryService;
            _mapper = mapper;
        }

        [HttpGet("dashboard")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<DashboardSummaryViewModel>> GetDashboardSummary()
        {
            var user = new UserDto { Id = HttpContext.User.GetUserId() };
            var summary = await _summaryService.GetDashboardSummaryAsync(user);
            return Ok(_mapper.Map<DashboardSummaryViewModel>(summary));
        }
    }
}

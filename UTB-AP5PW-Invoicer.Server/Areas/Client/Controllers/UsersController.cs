using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Areas.Client.Models;
using UTB_AP5PW_Invoicer.Server.Extensions;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers
{
    [ApiController]
    [Area("Client")]
    [Route("[area]/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("profile")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<GetProfileModel>> GetProfile()
        {
            var userId = HttpContext.User.GetUserId();
            var user = await _userService.GetUserAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(new GetProfileModel
            {
                Email = user.Email,
                FullName = user.FullName,
                CompanyName = user.CompanyName,
                Ico = user.Ico,
                Dic = user.Dic,
                CompanyAddress = user.CompanyAddress,
                CompanyPhone = user.CompanyPhone
            });
        }

        [HttpPut("profile")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> UpdateProfile([FromBody] UpdateProfileModel model)
        {
            var userId = HttpContext.User.GetUserId();
            var userDto = new UserDto
            {
                Id = userId,
                Email = model.Email,
                FullName = model.FullName,
                CompanyName = model.CompanyName,
                Ico = model.Ico,
                Dic = model.Dic,
                CompanyAddress = model.CompanyAddress,
                CompanyPhone = model.CompanyPhone
            };

            var result = await _userService.UpdateUserAsync(userDto);
            if (!result) return BadRequest("Unable to update profile");

            return Ok();
        }
    }
}

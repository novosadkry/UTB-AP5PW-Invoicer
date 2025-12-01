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

        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<object>> GetProfile()
        {
            var userId = HttpContext.User.GetUserId();
            var user = await _userService.GetUserAsync(userId);

            if (user == null)
                return NotFound();

            return Ok(new
            {
                user.Id,
                user.Email,
                user.FullName,
                user.Role,
                user.CompanyName,
                user.Ico,
                user.Dic,
                user.CompanyAddress,
                user.CompanyPhone,
                user.CreatedAt,
                user.UpdatedAt
            });
        }

        [HttpPut]
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
            if (!result)
                return BadRequest("Unable to update profile");

            return Ok();
        }
    }
}

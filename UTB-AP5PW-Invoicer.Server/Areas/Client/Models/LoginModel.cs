using System.ComponentModel.DataAnnotations;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Models
{
    public class LoginModel
    {
        [Required] public string Email { get; set; }
        [Required] public string Password { get; set; }
    }
}

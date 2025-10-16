using System.ComponentModel.DataAnnotations;

namespace UTB_AP5PW_Invoicer.Server.Models
{
    public class RegisterModel
    {
        [Required] public string Email { get; set; }
        [Required] public string Password { get; set; }
        [Required] public string FullName { get; set; }
    }
}

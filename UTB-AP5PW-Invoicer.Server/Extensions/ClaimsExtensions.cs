using System.Security.Claims;

namespace UTB_AP5PW_Invoicer.Server.Extensions
{
    public static class ClaimsExtensions
    {
        public static int GetUserId(this ClaimsPrincipal user)
        {
            var value = user.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new InvalidOperationException("User ID claim not found.");

            return int.Parse(value);
        }
    }
}

namespace UTB_AP5PW_Invoicer.Infrastructure.Configuration
{
    public class JwtOptions
    {
        public const string SectionName = "JwtSettings";

        public string SecretKey { get; set; }
    }
}

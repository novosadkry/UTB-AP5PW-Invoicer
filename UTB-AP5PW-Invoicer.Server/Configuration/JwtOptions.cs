namespace UTB_AP5PW_Invoicer.Server.Configuration
{
    public class JwtOptions
    {
        public const string SectionName = "JwtSettings";

        public string SecretKey { get; set; }
    }
}

namespace UTB_AP5PW_Invoicer.Application.DTOs
{
    public record CustomerDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}

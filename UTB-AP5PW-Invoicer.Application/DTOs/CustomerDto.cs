namespace UTB_AP5PW_Invoicer.Application.DTOs
{
    public record CustomerDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Name { get; set; }
        public string? Ico { get; set; }
        public string? Dic { get; set; }
        public string Address { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
    }
}

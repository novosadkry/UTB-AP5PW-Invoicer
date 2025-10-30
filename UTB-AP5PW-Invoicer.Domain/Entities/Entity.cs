namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public abstract class Entity<TKey>
    {
        public TKey Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}

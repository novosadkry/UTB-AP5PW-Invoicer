namespace UTB_AP5PW_Invoicer.Domain.Entities
{
    public abstract class Entity<TKey>
    {
        public TKey Id { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
    }
}

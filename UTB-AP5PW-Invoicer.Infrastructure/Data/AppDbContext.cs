using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Infrastructure.Authentication;

namespace UTB_AP5PW_Invoicer.Infrastructure.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder
                .UseSeeding((context, _) =>
                {
                    if (context is AppDbContext dbContext)
                        new DataSeeder(dbContext).SeedAsync(CancellationToken.None)
                            .GetAwaiter().GetResult();
                })
                .UseAsyncSeeding(async (context, _, cancellationToken) =>
                {
                    if (context is AppDbContext dbContext)
                        await new DataSeeder(dbContext).SeedAsync(cancellationToken);
                });
        }
    }
}

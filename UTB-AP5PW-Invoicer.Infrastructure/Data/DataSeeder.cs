using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Infrastructure.Data
{
    public class DataSeeder(AppDbContext dbContext)
    {
        public async Task SeedAsync(CancellationToken cancellationToken)
        {
            if (!dbContext.Users.Any())
            {
                var adminUser = new User
                {
                    Role = UserRole.Admin,
                    FullName = "Admin User",
                    Email = "admin@example.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("password"),
                };

                await dbContext.Users.AddAsync(adminUser, cancellationToken);
                await dbContext.SaveChangesAsync(cancellationToken);
            }
        }
    }
}

using MediatR;
using Microsoft.EntityFrameworkCore;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Commands.ForgotPassword
{
    public class ForgotPasswordCommandHandler(AppDbContext dbContext)
        : IRequestHandler<ForgotPasswordCommand, string?>
    {
        public async Task<string?> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
        {
            var user = await dbContext.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);

            if (user == null)
                return null;

            // Generate a password reset token
            var token = Guid.NewGuid().ToString("N");
            user.PasswordResetToken = token;
            user.PasswordResetExpiry = DateTimeOffset.UtcNow.AddHours(1);
            user.UpdatedAt = DateTimeOffset.UtcNow;

            await dbContext.SaveChangesAsync(cancellationToken);

            return token;
        }
    }
}

using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Commands.ChangeRole
{
    public class ChangeRoleCommandHandler(AppDbContext dbContext)
        : IRequestHandler<ChangeRoleCommand, bool>
    {
        public async Task<bool> Handle(ChangeRoleCommand request, CancellationToken cancellationToken)
        {
            var user = await dbContext.Users.FindAsync([request.UserId], cancellationToken);
            if (user == null) return false;

            user.Role = request.Role;
            user.UpdatedAt = DateTimeOffset.UtcNow;

            await dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}

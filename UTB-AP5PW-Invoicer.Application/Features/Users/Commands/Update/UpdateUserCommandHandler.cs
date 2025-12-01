using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Update
{
    public class UpdateUserCommandHandler(AppDbContext dbContext)
        : IRequestHandler<UpdateUserCommand, bool>
    {
        public async Task<bool> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var user = await dbContext.Users.FindAsync([request.Id], cancellationToken);
            if (user == null)
                return false;

            user.Email = request.Email;
            user.FullName = request.FullName;
            user.CompanyName = request.CompanyName;
            user.Ico = request.Ico;
            user.Dic = request.Dic;
            user.CompanyAddress = request.CompanyAddress;
            user.CompanyPhone = request.CompanyPhone;
            user.UpdatedAt = DateTimeOffset.UtcNow;

            await dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
    }
}

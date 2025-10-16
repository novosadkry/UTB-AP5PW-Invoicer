using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Domain.Entities;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Users.Commands.Create
{
    public class CreateUserCommandHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<CreateUserCommand, int>
    {
        public async Task<int> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var user = mapper.Map<User>(request);
            user.Role = UserRole.User;
            user.CreatedAt = DateTime.UtcNow;
            user.UpdatedAt = DateTime.UtcNow;

            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync(cancellationToken);

            return user.UserId;
        }
    }
}

using AutoMapper;
using MediatR;
using UTB_AP5PW_Invoicer.Infrastructure.Data;

namespace UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Update
{
    public class UpdateCustomerCommandHandler(AppDbContext dbContext, IMapper mapper)
        : IRequestHandler<UpdateCustomerCommand, bool>
    {
        public async Task<bool> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
        {
            var customer = await dbContext.Customers.FindAsync([request.Id], cancellationToken);
            if (customer == null) return false;

            mapper.Map(request, customer);
            await dbContext.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}

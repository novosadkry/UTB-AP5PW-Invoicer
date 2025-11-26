using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Services.Interfaces
{
    public interface ICustomerService : IService
    {
        Task<ICollection<CustomerDto>> ListCustomersAsync();
        Task<CustomerDto?> GetCustomerByIdAsync(int id);
        Task CreateCustomerAsync(CustomerDto customer);
        Task UpdateCustomerAsync(CustomerDto customer);
        Task DeleteCustomerAsync(CustomerDto customer);
    }
}

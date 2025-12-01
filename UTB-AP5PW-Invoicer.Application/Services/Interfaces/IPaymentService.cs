using UTB_AP5PW_Invoicer.Application.DTOs;

namespace UTB_AP5PW_Invoicer.Application.Services.Interfaces
{
    public interface IPaymentService : IService
    {
        Task<ICollection<PaymentDto>> ListPaymentsAsync(int invoiceId);
        Task<PaymentDto?> GetPaymentByIdAsync(int id);
        Task<int> CreatePaymentAsync(PaymentDto payment);
        Task<bool> DeletePaymentAsync(int id);
    }
}

using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Areas.Client.Models;
using UTB_AP5PW_Invoicer.Server.Areas.Client.ViewModels;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers
{
    [ApiController]
    [Area("Client")]
    [Route("[area]/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IMapper _mapper;

        public PaymentsController(IPaymentService paymentService, IMapper mapper)
        {
            _paymentService = paymentService;
            _mapper = mapper;
        }

        [HttpGet("invoice/{invoiceId:int}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IEnumerable<PaymentViewModel>> GetPaymentsByInvoice(int invoiceId)
        {
            var payments = await _paymentService.ListPaymentsAsync(invoiceId);
            return _mapper.Map<IEnumerable<PaymentViewModel>>(payments);
        }

        [HttpGet("{id:int}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<PaymentViewModel>> GetPayment(int id)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);
            if (payment == null) return NotFound();
            return Ok(_mapper.Map<PaymentViewModel>(payment));
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> CreatePayment([FromBody] CreatePaymentModel model)
        {
            var payment = _mapper.Map<PaymentDto>(model);
            var id = await _paymentService.CreatePaymentAsync(payment);
            return CreatedAtAction(nameof(GetPayment), new { id }, null);
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> DeletePayment(int id)
        {
            await _paymentService.DeletePaymentAsync(id);
            return Ok();
        }
    }
}

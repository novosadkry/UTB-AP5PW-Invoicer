using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Areas.Admin.Models;
using UTB_AP5PW_Invoicer.Server.Areas.Admin.ViewModels;

namespace UTB_AP5PW_Invoicer.Server.Areas.Admin.Controllers
{
    [ApiController]
    [Area("Admin")]
    [Route("[area]/[controller]")]
    [Authorize(Roles = "Admin")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly IMapper _mapper;

        public PaymentsController(IPaymentService paymentService, IMapper mapper)
        {
            _paymentService = paymentService;
            _mapper = mapper;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<PaymentViewModel>>> GetPaymentsByInvoice([FromQuery] int invoiceId)
        {
            var payments = await _paymentService.ListPaymentsAsync(invoiceId);
            return Ok(_mapper.Map<IEnumerable<PaymentViewModel>>(payments));
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<PaymentViewModel>> GetPayment(int id)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);
            if (payment == null) return NotFound();
            return Ok(_mapper.Map<PaymentViewModel>(payment));
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult> CreatePayment([FromBody] CreatePaymentModel model)
        {
            var payment = _mapper.Map<PaymentDto>(model);
            var id = await _paymentService.CreatePaymentAsync(payment);
            return CreatedAtAction(nameof(GetPayment), new { id }, null);
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult> DeletePayment(int id)
        {
            var result = await _paymentService.DeletePaymentAsync(id);
            if (!result) return BadRequest("Unable to delete payment");
            return Ok();
        }
    }
}

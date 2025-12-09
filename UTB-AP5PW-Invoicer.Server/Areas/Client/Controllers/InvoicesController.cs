using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Exports;
using UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Queries.List;
using UTB_AP5PW_Invoicer.Application.Features.Payments.Queries.List;
using UTB_AP5PW_Invoicer.Application.Services.Interfaces;
using UTB_AP5PW_Invoicer.Server.Extensions;

namespace UTB_AP5PW_Invoicer.Server.Areas.Client.Controllers
{
    [ApiController]
    [Area("Client")]
    [Route("[area]/[controller]")]
    public class InvoicesController : ControllerBase
    {
        private readonly IInvoiceService _invoiceService;
        private readonly IUserService _userService;
        private readonly ICustomerService _customerService;
        private readonly IInvoiceItemService _invoiceItemService;
        private readonly IMediator _mediator;

        public InvoicesController(
            IInvoiceService invoiceService,
            IUserService userService,
            ICustomerService customerService,
            IInvoiceItemService invoiceItemService,
            IMediator mediator)
        {
            _invoiceService = invoiceService;
            _userService = userService;
            _customerService = customerService;
            _invoiceItemService = invoiceItemService;
            _mediator = mediator;
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IEnumerable<InvoiceDto>> GetInvoices()
        {
            return await _invoiceService.ListInvoicesAsync();
        }

        [HttpGet("{id:int}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<InvoiceDto>> GetInvoice(int id)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(id);
            if (invoice == null) return NotFound();
            return Ok(invoice);
        }

        [HttpPost]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> CreateInvoice([FromBody] InvoiceDto invoice)
        {
            invoice.UserId = HttpContext.User.GetUserId();
            await _invoiceService.CreateInvoiceAsync(invoice);
            return CreatedAtAction(nameof(GetInvoice), new { id = invoice.Id }, invoice);
        }

        [HttpPut("{id:int}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> UpdateInvoice(int id, [FromBody] InvoiceDto invoice)
        {
            invoice.Id = id;
            await _invoiceService.UpdateInvoiceAsync(invoice);
            return Ok();
        }

        [HttpDelete("{id:int}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> DeleteInvoice(int id)
        {
            await _invoiceService.DeleteInvoiceAsync(new InvoiceDto { Id = id });
            return Ok();
        }

        [HttpGet("{id:int}/pdf")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> GetInvoicePdf(int id)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(id);
            if (invoice == null) return NotFound();

            var userId = HttpContext.User.GetUserId();
            var user = await _userService.GetUserAsync(userId);
            if (user == null) return NotFound();

            CustomerDto? customer = null;
            if (invoice.CustomerId.HasValue)
                customer = await _customerService.GetCustomerByIdAsync(invoice.CustomerId.Value);

            var items = await _mediator.Send(new ListInvoiceItemsQuery(id));
            var payments = await _mediator.Send(new ListPaymentsQuery(id));

            var document = new InvoicePdfDocument(invoice, customer, user, items, payments);
            var pdfBytes = document.GeneratePdf();

            return File(pdfBytes, "application/pdf", $"faktura-{invoice.InvoiceNumber}.pdf");
        }

        [HttpPost("{id:int}/share")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> GenerateShareLink(int id)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(id);
            if (invoice == null) return NotFound();

            var token = await _invoiceService.GenerateShareTokenAsync(invoice);
            if (token == null) return NotFound();

            return Ok(new { shareToken = token });
        }

        [HttpGet("shared/{token}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<InvoiceDto>> GetSharedInvoice(string token)
        {
            var invoice = await _invoiceService.GetInvoiceByShareTokenAsync(token);
            if (invoice == null) return NotFound();
            return Ok(invoice);
        }

        [HttpGet("shared/{token}/items")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetSharedInvoiceItems(string token)
        {
            var invoice = await _invoiceService.GetInvoiceByShareTokenAsync(token);
            if (invoice == null) return NotFound();

            var items = await _mediator.Send(new ListInvoiceItemsQuery(invoice.Id));
            return Ok(items);
        }

        [HttpGet("shared/{token}/payments")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetSharedInvoicePayments(string token)
        {
            var invoice = await _invoiceService.GetInvoiceByShareTokenAsync(token);
            if (invoice == null) return NotFound();

            var payments = await _mediator.Send(new ListPaymentsQuery(invoice.Id));
            return Ok(payments);
        }

        [HttpGet("shared/{token}/customer")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetSharedInvoiceCustomer(string token)
        {
            var invoice = await _invoiceService.GetInvoiceByShareTokenAsync(token);
            if (invoice == null) return NotFound();

            if (!invoice.CustomerId.HasValue) return NotFound();

            var customer = await _customerService.GetCustomerByIdAsync(invoice.CustomerId.Value);
            if (customer == null) return NotFound();

            return Ok(customer);
        }

        [HttpGet("shared/{token}/pdf")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> GetSharedInvoicePdf(string token)
        {
            var invoice = await _invoiceService.GetInvoiceByShareTokenAsync(token);
            if (invoice == null) return NotFound();

            var user = await _userService.GetUserAsync(invoice.UserId);
            if (user == null) return NotFound();

            CustomerDto? customer = null;
            if (invoice.CustomerId.HasValue)
                customer = await _customerService.GetCustomerByIdAsync(invoice.CustomerId.Value);

            var items = await _mediator.Send(new ListInvoiceItemsQuery(invoice.Id));
            var payments = await _mediator.Send(new ListPaymentsQuery(invoice.Id));

            var document = new InvoicePdfDocument(invoice, customer, user, items, payments);
            var pdfBytes = document.GeneratePdf();

            return File(pdfBytes, "application/pdf", $"faktura-{invoice.InvoiceNumber}.pdf");
        }

        [HttpGet("{invoiceId:int}/items")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<IEnumerable<InvoiceItemDto>>> GetInvoiceItems(int invoiceId)
        {
            var items = await _mediator.Send(new ListInvoiceItemsQuery(invoiceId));
            return Ok(items);
        }

        [HttpPost("{invoiceId:int}/items")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult> CreateInvoiceItem(int invoiceId, [FromBody] InvoiceItemDto invoiceItem)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(invoiceId);
            if (invoice == null) return NotFound();

            invoiceItem.InvoiceId = invoiceId;
            var id = await _invoiceItemService.CreateInvoiceItemAsync(invoiceItem);
            await _invoiceService.RecalculateInvoiceTotalAsync(invoice);

            return CreatedAtAction(nameof(GetInvoiceItems), new { invoiceId }, invoiceItem);
        }

        [HttpPut("{invoiceId:int}/items/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> UpdateInvoiceItem(int invoiceId, int id, [FromBody] InvoiceItemDto invoiceItem)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(invoiceId);
            if (invoice == null) return NotFound();

            var existingItem = await _invoiceItemService.GetInvoiceItemByIdAsync(id);
            if (existingItem == null) return NotFound();

            invoiceItem.InvoiceId = invoiceId;
            await _invoiceItemService.UpdateInvoiceItemAsync(invoiceItem);
            await _invoiceService.RecalculateInvoiceTotalAsync(invoice);

            return Ok();
        }

        [HttpDelete("{invoiceId:int}/items/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult> DeleteInvoiceItem(int invoiceId, int id)
        {
            var invoice = await _invoiceService.GetInvoiceByIdAsync(invoiceId);
            if (invoice == null) return NotFound();

            await _invoiceItemService.DeleteInvoiceItemAsync(new InvoiceItemDto { Id = id });
            await _invoiceService.RecalculateInvoiceTotalAsync(invoice);

            return Ok();
        }
    }
}

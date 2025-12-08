using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.InvoiceItems.Queries.List;

namespace UTB_AP5PW_Invoicer.Server.Areas.Admin.Controllers
{
    [ApiController]
    [Area("Admin")]
    [Route("[area]/[controller]")]
    [Authorize(Roles = "Admin")]
    public class InvoiceItemsController : ControllerBase
    {
        private readonly IMediator _mediator;

        public InvoiceItemsController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<IEnumerable<InvoiceItemDto>>> GetInvoiceItems([FromQuery] int invoiceId)
        {
            var items = await _mediator.Send(new ListInvoiceItemsQuery(invoiceId));
            return Ok(items);
        }
    }
}

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using UTB_AP5PW_Invoicer.Domain.Entities;

namespace UTB_AP5PW_Invoicer.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class InvoicesController : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public IEnumerable<Invoice> GetInvoices()
        {
            return [new Invoice()];
        }
    }
}

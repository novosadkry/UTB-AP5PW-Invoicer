using AutoMapper;
using FluentValidation;
using MediatR;
using Moq;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Delete;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Commands.Update;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.Get;
using UTB_AP5PW_Invoicer.Application.Features.Invoices.Queries.List;
using UTB_AP5PW_Invoicer.Application.Services.Implementations;

namespace UTB_AP5PW_Invoicer.Tests.Services
{
    public class InvoiceServiceTests
    {
        [Fact]
        public async Task GetInvoiceByIdAsync_SendsGetInvoiceQuery()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            var mockValidator = new Mock<IValidator<InvoiceDto>>();

            mockMediator
                .Setup(m => m.Send(It.IsAny<GetInvoiceQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new InvoiceDto { Id = 1 });

            var service = new InvoiceService(mockMediator.Object, mockMapper.Object, mockValidator.Object);
            var result = await service.GetInvoiceByIdAsync(1);

            Assert.NotNull(result);
            mockMediator.Verify(m =>
                m.Send(It.Is<GetInvoiceQuery>(q => q.Id == 1), It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task ListInvoicesAsync_SendsListInvoicesQuery()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            var mockValidator = new Mock<IValidator<InvoiceDto>>();

            mockMediator
                .Setup(m => m.Send(It.IsAny<ListInvoicesQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<InvoiceDto>());

            var service = new InvoiceService(mockMediator.Object, mockMapper.Object, mockValidator.Object);
            var result = await service.ListInvoicesAsync();

            Assert.NotNull(result);
            mockMediator.Verify(m =>
                m.Send(It.IsAny<ListInvoicesQuery>(), It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task CreateInvoiceAsync_ValidatesAndSendsCreateCommand()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            var mockValidator = new Mock<IValidator<InvoiceDto>>();

            mockMediator
                .Setup(m => m.Send(It.IsAny<CreateInvoiceCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(It.IsAny<int>());

            var service = new InvoiceService(mockMediator.Object, mockMapper.Object, mockValidator.Object);
            var dto = new InvoiceDto { Id = 1, InvoiceNumber = "INV-1" };

            await service.CreateInvoiceAsync(dto);

            mockValidator.Verify(
                v => v.ValidateAsync(It.IsAny<ValidationContext<InvoiceDto>>(), It.IsAny<CancellationToken>()),
                Times.Once);
            mockMediator.Verify(
                m => m.Send(It.IsAny<CreateInvoiceCommand>(), It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task UpdateInvoiceAsync_ValidatesAndSendsUpdateCommand()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            var mockValidator = new Mock<IValidator<InvoiceDto>>();

            mockMediator
                .Setup(m => m.Send(It.IsAny<UpdateInvoiceCommand>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var service = new InvoiceService(mockMediator.Object, mockMapper.Object, mockValidator.Object);
            var dto = new InvoiceDto { Id = 1, InvoiceNumber = "INV-1" };

            await service.UpdateInvoiceAsync(dto);

            mockValidator.Verify(v =>
                v.ValidateAsync(It.IsAny<ValidationContext<InvoiceDto>>(), It.IsAny<CancellationToken>()),
                Times.Once);
            mockMediator.Verify(m =>
                m.Send(It.IsAny<UpdateInvoiceCommand>(), It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task DeleteInvoiceAsync_SendsDeleteCommand()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            var mockValidator = new Mock<IValidator<InvoiceDto>>();

            mockMediator
                .Setup(m => m.Send(It.IsAny<DeleteInvoiceCommand>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            var service = new InvoiceService(mockMediator.Object, mockMapper.Object, mockValidator.Object);
            var dto = new InvoiceDto { Id = 1 };

            await service.DeleteInvoiceAsync(dto);

            mockMediator.Verify(m =>
                m.Send(It.Is<DeleteInvoiceCommand>(c => c.Id == 1), It.IsAny<CancellationToken>()),
                Times.Once);
        }
    }
}

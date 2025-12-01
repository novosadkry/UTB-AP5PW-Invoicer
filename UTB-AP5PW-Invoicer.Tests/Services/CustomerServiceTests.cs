using AutoMapper;
using FluentValidation;
using MediatR;
using Moq;
using UTB_AP5PW_Invoicer.Application.DTOs;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Create;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Delete;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Commands.Update;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Queries.Get;
using UTB_AP5PW_Invoicer.Application.Features.Customers.Queries.List;
using UTB_AP5PW_Invoicer.Application.Services.Implementations;

namespace UTB_AP5PW_Invoicer.Tests.Services
{
    public class CustomerServiceTests
    {
        [Fact]
        public async Task GetCustomerByIdAsync_SendsGetCustomerQuery()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            var mockValidator = new Mock<IValidator<CustomerDto>>();

            mockMediator
                .Setup(m => m.Send(It.IsAny<GetCustomerQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new CustomerDto { Id = 1 });

            var service = new CustomerService(mockMediator.Object, mockMapper.Object, mockValidator.Object);
            var result = await service.GetCustomerByIdAsync(1);

            Assert.NotNull(result);
            mockMediator.Verify(m =>
                m.Send(It.Is<GetCustomerQuery>(q => q.Id == 1), It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task ListCustomersAsync_SendsListCustomersQuery()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            var mockValidator = new Mock<IValidator<CustomerDto>>();

            mockMediator
                .Setup(m => m.Send(It.IsAny<ListCustomersQuery>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<CustomerDto>());

            var service = new CustomerService(mockMediator.Object, mockMapper.Object, mockValidator.Object);
            var result = await service.ListCustomersAsync();

            Assert.NotNull(result);
            mockMediator.Verify(m =>
                m.Send(It.IsAny<ListCustomersQuery>(), It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task CreateCustomerAsync_ValidatesAndSendsCreateCommand()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            var mockValidator = new Mock<IValidator<CustomerDto>>();

            mockMediator
                .Setup(m => m.Send(It.IsAny<CreateCustomerCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(It.IsAny<int>());

            var service = new CustomerService(mockMediator.Object, mockMapper.Object, mockValidator.Object);
            var dto = new CustomerDto { Id = 1, Name = "Customer" };

            await service.CreateCustomerAsync(dto);

            mockValidator.Verify(v =>
                v.ValidateAsync(It.IsAny<ValidationContext<CustomerDto>>(), It.IsAny<CancellationToken>()),
                Times.Once);
            mockMediator.Verify(m =>
                m.Send(It.IsAny<CreateCustomerCommand>(), It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task UpdateCustomerAsync_ValidatesAndSendsUpdateCommand()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            var mockValidator = new Mock<IValidator<CustomerDto>>();

            mockMediator
                .Setup(m => m.Send(It.IsAny<UpdateCustomerCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            var service = new CustomerService(mockMediator.Object, mockMapper.Object, mockValidator.Object);
            var dto = new CustomerDto { Id = 1, Name = "Customer" };

            await service.UpdateCustomerAsync(dto);

            mockValidator.Verify(v =>
                v.ValidateAsync(It.IsAny<ValidationContext<CustomerDto>>(), It.IsAny<CancellationToken>()),
                Times.Once);
            mockMediator.Verify(m =>
                m.Send(It.IsAny<UpdateCustomerCommand>(), It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task DeleteCustomerAsync_SendsDeleteCommand()
        {
            var mockMapper = new Mock<IMapper>();
            var mockMediator = new Mock<IMediator>();
            var mockValidator = new Mock<IValidator<CustomerDto>>();

            mockMediator.Setup(m =>
                m.Send(It.IsAny<DeleteCustomerCommand>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(true);

            var service = new CustomerService(mockMediator.Object, mockMapper.Object, mockValidator.Object);
            var dto = new CustomerDto { Id = 1 };

            await service.DeleteCustomerAsync(dto);

            mockMediator.Verify(m =>
                m.Send(It.Is<DeleteCustomerCommand>(c => c.Id == 1), It.IsAny<CancellationToken>()),
                Times.Once);
        }
    }
}

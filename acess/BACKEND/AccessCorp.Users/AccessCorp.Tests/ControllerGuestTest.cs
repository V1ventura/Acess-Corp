using AccessCorpUsers.Domain.Entities;
using AccessCorpUsers.Infra.Context;
using Microsoft.EntityFrameworkCore;
using Moq;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using AccessCorpUsers.WebApi.Controllers;
using Microsoft.AspNetCore.Mvc;
using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Infra.Repositories;
using AccessCorpUsers.Domain.Interfaces;
using AccessCorpUsers.Application.Services;
using AutoMapper;

namespace AccessCorpUsers.Test
{
    public class ControllerGuestTest
    {
        [Fact]
        public async void GuestController_GenerateQrCode_Success()
        {
            // Arrange
            // DbContext Options 
            var options = new DbContextOptionsBuilder<AccessCorpUsersDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new AccessCorpUsersDbContext(options);

            var guestData = GenerateNewGuest();

            context.Guests.Add(guestData);
            await context.SaveChangesAsync();

            // Repositories
            var guestRepository = new GuestRepository(context);
            var doormanRepositoryMock = new Mock<IDoormanRepository>();

            // QR Code Service
            var qrCodeService = new QrCodeGeneratorService();

            // AutoMapper
            var mapperConfig = new MapperConfiguration(dest =>
            {
                dest.CreateMap<Guest, GuestVM>().ReverseMap();
            });
            var mapper = mapperConfig.CreateMapper();

            // Identity
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Email, "porteiro@email.com")
            };

            var identity = new ClaimsIdentity(claims, "TestAuth");

            var principal = new ClaimsPrincipal(identity);

            // HttpContext
            var mockHttpContext = new Mock<HttpContext>();
            mockHttpContext.Setup(c => c.User).Returns(principal);

            // Guest Service
            var guestService = new GuestService(mapper, guestRepository, doormanRepositoryMock.Object, qrCodeService);

            var controller = new GuestController(guestService)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = mockHttpContext.Object
                }
            };

            // Act
            var result = await controller.GenerateQrCode(guestData.Email);

            // Assert
            Assert.IsType<OkObjectResult>(result);
            Assert.NotNull(result);
        }

        [Fact]
        public async void GuestController_ViewAllGuest_Succes()
        {
            // Arrange
            // DbContext Options 
            var options = new DbContextOptionsBuilder<AccessCorpUsersDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var context = new AccessCorpUsersDbContext(options);

            var guestData = GenerateNewGuest();
            var doormanData = GenerateNewDoorman();

            context.Doormans.Add(doormanData);
            context.Guests.Add(guestData);
            await context.SaveChangesAsync();

            // Repositories
            var guestRepository = new GuestRepository(context);
            var doormanRepositoryMock = new Mock<IDoormanRepository>();
            doormanRepositoryMock.Setup(r => r.GetDoormanByEmail("porteiro@email.com"))
                .ReturnsAsync(new Doorman
                {
                    Id = Guid.NewGuid(),
                    Email = "porteiro@email.com",
                    Cep = guestData.Cep
                });

            // QR Code Service
            var qrCodeService = new QrCodeGeneratorService();

            // AutoMapper
            var mapperConfig = new MapperConfiguration(dest =>
            {
                dest.CreateMap<Guest, GuestVM>().ReverseMap();
            });
            var mapper = mapperConfig.CreateMapper();

            // Identity
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Email, "porteiro@email.com")
            };

            var identity = new ClaimsIdentity(claims, "TestAuth");

            var principal = new ClaimsPrincipal(identity);

            // HttpContext
            var mockHttpContext = new Mock<HttpContext>();
            mockHttpContext.Setup(c => c.User).Returns(principal);

            // Guest Service
            var guestService = new GuestService(mapper, guestRepository, doormanRepositoryMock.Object, qrCodeService);

            var controller = new GuestController(guestService)
            {
                ControllerContext = new ControllerContext
                {
                    HttpContext = mockHttpContext.Object
                }
            };

            // Act
            var result = await controller.ViewAllGuest();

            // Assert
            var assertResult = Assert.IsType<OkObjectResult>(result.Result);
            Assert.IsType<Result>(assertResult.Value);
        }

        private Guest GenerateNewGuest()
        {
            return new Guest
            {
                Id = Guid.NewGuid(),
                Cep = "03633000",
                CepGuest = "03765000",
                Cpf = "15359930144",
                Email = "emailunitteste@unit.com",
                Name = "First Name",
                LastName = "Last Name",
                Phone = "1234567890",
            };
        }

        private Doorman GenerateNewDoorman()
        {
            return new Doorman
            {
                Id = Guid.NewGuid(),
                Cep = "03633000",
                IdentityId = Guid.NewGuid(),
                Cpf = "04537802002",
                Email = "porteiro@email.com",
                Name = "Dormaan Unit",
                LastName = "UNIT Test",
                Phone = "1234567890",
                Password = "@Unit2teste"
            };
        }
    }
}
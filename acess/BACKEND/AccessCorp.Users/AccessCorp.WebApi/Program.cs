using AccessCorpUsers.Application.Configuration;
using AccessCorpUsers.Application.Interfaces;
using AccessCorpUsers.Application.Services;
using AccessCorpUsers.Domain.Interfaces;
using AccessCorpUsers.Infra.Context;
using AccessCorpUsers.Infra.Repositories;
using AccessCorpUsers.WebApi.Configuration;
using AccessCorpUsers.WebApi.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AccessCorpUsersDbContext>(op =>
{
    op.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.AddApiConfiguration()
    .AddJwtConfiguration()
    .AddSwaggerConfiguration()
    .AddCorsConfiguration();

builder.Services.AddAutoMapper(typeof(AutomapperConfig));

builder.Services.AddHttpContextAccessor();

builder.Services.Configure<IdentityApiSettings>(builder.Configuration.GetSection("IdentityApi"));
builder.Services.AddScoped<IAdministratorRepository, AdministratorRepository>();
builder.Services.AddScoped<IAdministratorService, AdministratorService>();
builder.Services.AddScoped<IDeliveryRepository, DeliveryRepository>();
builder.Services.AddScoped<IDeliveryService, DeliveryService>();
builder.Services.AddScoped<IDoormanRepository, DoormanRepository>();
builder.Services.AddScoped<IDoormanService, DoormanService>();
builder.Services.AddHttpClient<IIdentityApiClient, IdentityApiClient>()
    .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
    {
        ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
    });
builder.Services.AddScoped<IResidentRepository, ResidentRepository>();
builder.Services.AddScoped<IResidentService, ResidentService>();
builder.Services.AddScoped<IGuestRepository, GuestRepository>();
builder.Services.AddScoped<IGuestService, GuestService>();
builder.Services.AddScoped<IQrCodeGeneratorService, QrCodeGeneratorService>();
builder.Services.AddScoped<IImageService, ImageService>();

var app = builder.Build();

app.UseApiConfiguration();
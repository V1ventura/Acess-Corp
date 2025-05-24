using AccessCorp.Application.Entities;
using AccessCorp.Application.Interfaces;
using AccessCorp.Application.Services;
using AccessCorp.Domain.Interfaces;
using AccessCorp.Domain.Services;
using AccessCorp.WebApi.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace AccessCorp.WebApi.Configuration;

public static class DependencyInjectionConfig
{
    public static WebApplicationBuilder AddDependencyInjectionConfiguration(this WebApplicationBuilder builder)
    {
        builder.Services.Configure<SendGridSettings>(builder.Configuration.GetSection("SendGrid"));

        builder.Services.AddSingleton<SendEmailService>();

        builder.Services.AddScoped<IDoormanService, DoormanService>();
        builder.Services.AddTransient<ISendEmailService, SendEmailService>();
        builder.Services.AddScoped<IAuthService, AuthService>();
        builder.Services.AddScoped<IAdministratorService, AdministratorService>();
        builder.Services.AddScoped<IUserClaimsService, UserClaimsService>();
        builder.Services.AddScoped<ICepValidationService, CepValidationService>();
        builder.Services.AddScoped<IJwtService, JwtService>();

        builder.Services.AddScoped<IAuthorizationHandler, PermissionHandler>();
        
        return builder;
    }
}
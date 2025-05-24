using AccessCorp.WebApi.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.AddApiConfiguration()
    .AddIdentityConfiguration()
    .AddSwaggerConfiguration()
    .AddDependencyInjectionConfiguration()
    .AddCorsConfiguration();

var app = builder.Build();

app.UseApiConfiguration();
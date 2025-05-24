using Microsoft.AspNetCore.HttpOverrides;
using System.Reflection;

namespace AccessCorp.WebApi.Configuration;

public static class ApiConfig
{
    public static WebApplicationBuilder AddApiConfiguration(this WebApplicationBuilder builder)
    {
        builder.Configuration.SetBasePath(builder.Environment.ContentRootPath)
            .AddJsonFile("appsettings.json", true, true)
            .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", true, true)
            .AddEnvironmentVariables()
            .AddUserSecrets(Assembly.GetExecutingAssembly(), true);
        
        builder.Services.AddControllers();
        
        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders =
                ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
        });

        return builder;
    }

    public static WebApplication UseApiConfiguration(this WebApplication app)
    {
        app.UseForwardedHeaders();

        app.UseSwaggerConfiguration();

        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseCorsConfiguration();

        app.UseHttpsRedirection();

        app.UseRouting(); 

        app.UseAuthentication(); 
        app.UseAuthorization(); 

        app.UseIdentityConfiguration(); 

        app.MapControllers();

        app.Run();
        return app;
    }
}
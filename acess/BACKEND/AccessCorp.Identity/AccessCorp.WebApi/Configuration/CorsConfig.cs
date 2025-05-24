namespace AccessCorp.WebApi.Configuration
{
    public static class CorsConfig
    {
        public static WebApplicationBuilder AddCorsConfiguration(this WebApplicationBuilder builder)
        {
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("Development", builder =>
                {
                    builder.WithOrigins(
                                "http://localhost:5500",
                                "http://127.0.0.1:5500",
                                "http://localhost:5164",
                                "https://localhost:7100",
                                "http://localhost:5225",
                                "https://localhost:7061")
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                });
            });
            return builder;
        }

        public static WebApplication UseCorsConfiguration(this WebApplication app)
        {
            app.UseCors("Development");

            return app;
        }
    }
}
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release 
WORKDIR /src
COPY ["AccessCorp.Identity/AccessCorp.WebApi/AccessCorp.WebApi.csproj", "AccessCorp.Identity/AccessCorp.WebApi/"]
COPY ["AccessCorp.Identity/AccessCorp.Domain/AccessCorp.Domain.csproj", "AccessCorp.Identity/AccessCorp.Domain/"]
COPY ["AccessCorp.Identity/AccessCorp.Application/AccessCorp.Application.csproj", "AccessCorp.Identity/AccessCorp.Application/"]
COPY ["AccessCorp.Identity/AccessCorp.Infra/AccessCorp.Infra.csproj", "AccessCorp.Identity/AccessCorp.Infrastructure/"]
RUN dotnet restore "./AccessCorp.Identity/AccessCorp.WebApi/AccessCorp.WebApi.csproj"
COPY . .
WORKDIR "AccessCorp.Identity/AccessCorp.WebApi"
RUN dotnet build "AccessCorp.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./AccessCorp.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AccessCorp.WebApi.dll"]
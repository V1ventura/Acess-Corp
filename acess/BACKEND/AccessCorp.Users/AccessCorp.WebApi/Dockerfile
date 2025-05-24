FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release 
WORKDIR /src
COPY ["AccessCorp.Users/AccessCorp.WebApi/AccessCorpUsers.WebApi.csproj", "AccessCorp.Users/AccessCorp.WebApi/"]
COPY ["AccessCorp.Users/AccessCorp.Domain/AccessCorpUsers.Domain.csproj", "AccessCorp.Users/AccessCorp.Domain/"]
COPY ["AccessCorp.Users/AccessCorp.Application/AccessCorpUsers.Application.csproj", "AccessCorp.Users/AccessCorp.Application/"]
COPY ["AccessCorp.Users/AccessCorp.Infra/AccessCorpUsers.Infra.csproj", "AccessCorp.Users/AccessCorp.Infrastructure/"]
RUN dotnet restore "./AccessCorp.Users/AccessCorp.WebApi/AccessCorpUsers.WebApi.csproj"
COPY . .
WORKDIR "AccessCorp.Users/AccessCorp.WebApi"
RUN dotnet build "AccessCorpUsers.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./AccessCorpUsers.WebApi.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AccessCorpUsers.WebApi.dll"]
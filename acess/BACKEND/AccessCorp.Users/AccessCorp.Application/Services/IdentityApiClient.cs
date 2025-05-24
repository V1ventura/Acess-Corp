using AccessCorpUsers.Application.Configuration;
using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Application.Interfaces;
using AccessCorpUsers.Domain.Entities;
using Microsoft.Extensions.Options;
using System.Text.Json;
using System.Text;
using Microsoft.AspNetCore.Http;
using System.Net.Http.Headers;
using Microsoft.Win32;
using System.Security.Principal;

namespace AccessCorpUsers.Application.Services;

public class IdentityApiClient : IIdentityApiClient
{
    private readonly HttpClient _httpClient;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IdentityApiSettings _identityApiSettings;

    
    public IdentityApiClient(HttpClient httpClient, IOptions<IdentityApiSettings> identityApiSettings, IHttpContextAccessor httpContextAccessor)
    {
        _httpClient = httpClient;
        _httpContextAccessor = httpContextAccessor;
        _identityApiSettings = identityApiSettings.Value;
        _httpClient.BaseAddress = new Uri(_identityApiSettings.BaseUrl);
    }

    public async Task<AdministratorResponse> ViewAdministratorByEmailAsync(string email)
    {
        AddHeaders();

        var result = await _httpClient.GetAsync($"identity/v1/administrator/view/{email}");
       
        if (!result.IsSuccessStatusCode)
        {
            string errorResponse = await result.Content.ReadAsStringAsync();
            Console.WriteLine($"Erro {result.StatusCode}: {errorResponse}");
            throw new Exception($"Erro na requisição: {result.StatusCode} - {errorResponse}");
        }

        string responseBody = await result.Content.ReadAsStringAsync();
        
        var administrator = JsonSerializer.Deserialize<AdministratorResponse>(responseBody, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        return administrator;
    }

    public async Task<HttpResponseMessage> RegisterAdministratorAsync(AdministratorIdentityRequest requestIdentity)
    {
        var jsonContent = JsonSerializer.Serialize(requestIdentity);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        AddHeaders();

        var result = await _httpClient.PostAsync($"identity/v1/administrator/register", content);

        if (!result.IsSuccessStatusCode)
        {
            string errorResponse = await result.Content.ReadAsStringAsync();
            Console.WriteLine($"Erro {result.StatusCode}: {errorResponse}");
            throw new Exception($"Erro na requisição: {result.StatusCode} - {errorResponse}");
        }

        return result;
    }

    public async Task<HttpResponseMessage> UpdateAdministratorAsync(string email, AdministratorIdentityRequest requestIdentity)
    {
        var jsonContent = JsonSerializer.Serialize(requestIdentity);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        AddHeaders();

        var result = await _httpClient.PutAsync($"identity/v1/administrator/update/{email}", content);

        if (!result.IsSuccessStatusCode)
        {
            string errorResponse = await result.Content.ReadAsStringAsync();
            Console.WriteLine($"Erro {result.StatusCode}: {errorResponse}");
            throw new Exception($"Erro na requisição: {result.StatusCode} - {errorResponse}");
        }

        return result;
    }

    public async Task<HttpResponseMessage> ExcludeAdministratorAsync(string email)
    {
        AddHeaders();
        var result = await _httpClient.DeleteAsync($"/identity/v1/administrator/exclude/{email}");

        if (!result.IsSuccessStatusCode)
        {
            string errorResponse = await result.Content.ReadAsStringAsync();
            Console.WriteLine($"Erro {result.StatusCode}: {errorResponse}");
            throw new Exception($"Erro na requisição: {result.StatusCode} - {errorResponse}");
        }

        return result;
    }

    public Task<AdministratorResponse> ViewDoormanByEmailAsync(string email)
    {
        throw new NotImplementedException();
    }

    public async Task<HttpResponseMessage> RegisterDoormanAsync(DoormanIdentityRequest requestIdentity)
    {
        var jsonContent = JsonSerializer.Serialize(requestIdentity);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        AddHeaders();

        var result = await _httpClient.PostAsync($"/identity/v1/doorman/register", content);

        if (!result.IsSuccessStatusCode)
        {
            string errorResponse = await result.Content.ReadAsStringAsync();
            Console.WriteLine($"Erro {result.StatusCode}: {errorResponse}");
            throw new Exception($"Erro na requisição: {result.StatusCode} - {errorResponse}");
        }

        return result;
    }

    public async Task<HttpResponseMessage> UpdateDoormanAsync(string email, DoormanIdentityRequest requestIdentity)
    {
        var jsonContent = JsonSerializer.Serialize(requestIdentity);
        var content = new StringContent(jsonContent, Encoding.UTF8, "application/json");

        AddHeaders();

        var result = await _httpClient.PutAsync($"/identity/v1/doorman/update/{email}", content);

        if (!result.IsSuccessStatusCode)
        {
            string errorResponse = await result.Content.ReadAsStringAsync();
            Console.WriteLine($"Erro {result.StatusCode}: {errorResponse}");
            throw new Exception($"Erro na requisição: {result.StatusCode} - {errorResponse}");
        }

        return result;
    }

    public async Task<HttpResponseMessage> ExcludeDoormanAsync(string email)
    {
        AddHeaders();
        var result = await _httpClient.DeleteAsync($"/identity/v1/doorman/exclude/{email}");

        if (!result.IsSuccessStatusCode)
        {
            string errorResponse = await result.Content.ReadAsStringAsync();
            Console.WriteLine($"Erro {result.StatusCode}: {errorResponse}");
            throw new Exception($"Erro na requisição: {result.StatusCode} - {errorResponse}");
        }

        return result;
    }


    private void AddHeaders()
    {
        string token = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"];

        token = token.Substring("Bearer ".Length).Trim();

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        return;
    }
}
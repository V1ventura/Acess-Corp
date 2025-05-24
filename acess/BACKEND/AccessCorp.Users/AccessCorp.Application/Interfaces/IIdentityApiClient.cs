using AccessCorpUsers.Application.Entities;
namespace AccessCorpUsers.Application.Interfaces;

public interface IIdentityApiClient
{
    public Task<AdministratorResponse> ViewAdministratorByEmailAsync(string email);    
    public Task<HttpResponseMessage> RegisterAdministratorAsync(AdministratorIdentityRequest requestIdentity);
    public Task<HttpResponseMessage> UpdateAdministratorAsync(string email, AdministratorIdentityRequest requestIdentity);
    public Task<HttpResponseMessage> ExcludeAdministratorAsync(string email);
    public Task<AdministratorResponse> ViewDoormanByEmailAsync(string email);
    public Task<HttpResponseMessage> RegisterDoormanAsync(DoormanIdentityRequest requestIdentity);
    public Task<HttpResponseMessage> UpdateDoormanAsync(string email, DoormanIdentityRequest requestIdentity);
    public Task<HttpResponseMessage> ExcludeDoormanAsync(string email);
}
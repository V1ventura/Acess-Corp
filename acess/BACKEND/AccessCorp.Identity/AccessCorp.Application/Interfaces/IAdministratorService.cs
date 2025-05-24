using AccessCorp.Application.Entities;

namespace AccessCorp.Application.Interfaces;

public interface IAdministratorService
{
    public Task<Result> ViewAdministrator(string email);
    public Task<Result> EditAdministrator(string email, AdministratorUpdateVM request);
    public Task<Result> ExcludeAdministrator(string email);
}
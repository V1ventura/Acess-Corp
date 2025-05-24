using AccessCorpUsers.Application.Entities;

namespace AccessCorpUsers.Application.Interfaces
{
    public interface IAdministratorService
    {
        public Task<Result> ViewAllAdministrators(string email);
        public Task<AdministratorVM> ViewAdministratorByEmail(string email);
        public Task<Result> RegisterAdministrator(AdministratorVM request);
        public Task<Result> UpdateAdministrator(string email, AdministratorVM request);
        public Task<Result> ExcludeAdministrator(string email);
        public Task<AdministratorVM> GetAdminDoormansResidents(string email);
    }
}

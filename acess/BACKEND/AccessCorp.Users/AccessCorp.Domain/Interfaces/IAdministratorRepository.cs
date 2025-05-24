using AccessCorpUsers.Domain.Entities;

namespace AccessCorpUsers.Domain.Interfaces;

public interface IAdministratorRepository : IRepository<Administrator>
{
    Task<Administrator> GetAdminByEmail(string email);
    Task<IEnumerable<Administrator>> GetAdminsByCep(string cep);
    Task<Administrator> GetAdminDoormansResidents(string cep);
}
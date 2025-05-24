using AccessCorpUsers.Domain.Entities;

namespace AccessCorpUsers.Domain.Interfaces
{
    public interface IResidentRepository : IRepository<Resident> 
    {
        Task<Resident> GetResidentByEmail(string email);
        Task<IEnumerable<Resident>> GetResidentsByCep(string cep);
    }
}

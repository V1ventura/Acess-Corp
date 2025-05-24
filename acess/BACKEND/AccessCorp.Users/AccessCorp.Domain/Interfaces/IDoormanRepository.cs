using AccessCorpUsers.Domain.Entities;

namespace AccessCorpUsers.Domain.Interfaces
{
    public interface IDoormanRepository : IRepository<Doorman>
    {
        Task<Doorman> GetDoormanByEmail(string email);
        Task<IEnumerable<Doorman>> GetDoormanByCep(string cep);
    }
}

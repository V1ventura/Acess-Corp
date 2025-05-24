using AccessCorpUsers.Domain.Entities;

namespace AccessCorpUsers.Domain.Interfaces
{
    public interface IGuestRepository : IRepository<Guest>
    {
        Task<Guest> GetGuestByEmail(string email);
        Task<IEnumerable<Guest>> GetGuestByCep(string cep);
    }
}

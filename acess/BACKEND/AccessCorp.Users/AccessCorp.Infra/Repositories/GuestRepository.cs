using AccessCorpUsers.Domain.Entities;
using AccessCorpUsers.Domain.Interfaces;
using AccessCorpUsers.Infra.Context;

namespace AccessCorpUsers.Infra.Repositories
{
    public class GuestRepository : Repository<Guest>, IGuestRepository
    {
        public GuestRepository(AccessCorpUsersDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Guest>> GetGuestByCep(string cep)
        {
            return await Find(d => d.Cep == cep);
        }

        public async Task<Guest> GetGuestByEmail(string email)
        {
            var doorman = await Find(d => d.Email == email);

            return doorman.FirstOrDefault();
        }
    }
}

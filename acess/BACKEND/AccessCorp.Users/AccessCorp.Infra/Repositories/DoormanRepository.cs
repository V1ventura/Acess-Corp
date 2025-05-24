using AccessCorpUsers.Domain.Entities;
using AccessCorpUsers.Domain.Interfaces;
using AccessCorpUsers.Infra.Context;

namespace AccessCorpUsers.Infra.Repositories
{
    public class DoormanRepository : Repository<Doorman>, IDoormanRepository
    {
        public DoormanRepository(AccessCorpUsersDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Doorman>> GetDoormanByCep(string cep)
        {
            return await Find(d => d.Cep == cep);
        }

        public async Task<Doorman> GetDoormanByEmail(string email)
        {
            var doorman = await Find(d => d.Email == email);

            return doorman.FirstOrDefault();
        }
    }
}

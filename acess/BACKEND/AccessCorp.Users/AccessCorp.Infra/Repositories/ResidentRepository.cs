using AccessCorpUsers.Domain.Entities;
using AccessCorpUsers.Domain.Interfaces;
using AccessCorpUsers.Infra.Context;

namespace AccessCorpUsers.Infra.Repositories
{
    public class ResidentRepository : Repository<Resident>, IResidentRepository
    {
        public ResidentRepository(AccessCorpUsersDbContext context) : base(context)
        {
        }

        public async Task<Resident> GetResidentByEmail(string email)
        {
            var resident = await Find(r => r.Email == email);

            return resident.FirstOrDefault();
        }

        public async Task<IEnumerable<Resident>> GetResidentsByCep(string cep)
        {
            return await Find(r => r.Cep == cep);
        }
    }
}

using AccessCorpUsers.Domain.Entities;
using AccessCorpUsers.Domain.Interfaces;
using AccessCorpUsers.Infra.Context;

namespace AccessCorpUsers.Infra.Repositories
{
    public class DeliveryRepository : Repository<Delivery>, IDeliveryRepository
    {
        public DeliveryRepository(AccessCorpUsersDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Delivery>> GetDeliveriesByCep(string cep)
        {
            return await Find(d => d.Cep == cep);
        }
    }
}

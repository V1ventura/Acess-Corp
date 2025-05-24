using AccessCorpUsers.Domain.Entities;

namespace AccessCorpUsers.Domain.Interfaces
{
    public interface IDeliveryRepository : IRepository<Delivery>
    {
        Task<IEnumerable<Delivery>> GetDeliveriesByCep(string cep);
    }
}

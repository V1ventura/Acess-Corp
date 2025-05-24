using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Application.Interfaces;
using AccessCorpUsers.Domain.Entities;
using AccessCorpUsers.Domain.Interfaces;
using AccessCorpUsers.Domain.Validations.DocsValidation;
using AccessCorpUsers.Infra.Repositories;
using AutoMapper;

namespace AccessCorpUsers.Application.Services
{
    public class DeliveryService : IDeliveryService
    {
        private readonly IDeliveryRepository _deliveryRepository;
        private readonly IDoormanRepository _doormanRepository;
        private readonly IAdministratorRepository _administratorRepository;
        private readonly IMapper _mapper;

        public DeliveryService(IDeliveryRepository deliveryRepository, IDoormanRepository doormanRepository, IAdministratorRepository administratorRepository, IMapper mapper)
        {
            _deliveryRepository = deliveryRepository;
            _doormanRepository = doormanRepository;
            _administratorRepository = administratorRepository;
            _mapper = mapper;
        }

        public async Task<Result> ViewAllDeliveries(string email)
        {
            string cep = string.Empty;

            var doorman = await _doormanRepository.GetDoormanByEmail(email);

            if (doorman != null)
                cep = doorman.Cep;

            if (string.IsNullOrEmpty(cep))
            {
                var admin = await _administratorRepository.GetAdminByEmail(email);
                cep = admin.Cep;
            }

            var deliveries = await _deliveryRepository.GetDeliveriesByCep(cep);

            var deliveryVM = _mapper.Map<List<DeliveryVM>>(deliveries);

            return Result.Ok(deliveryVM);
        }

        public async Task<Result> RegisterDelivery(DeliveryVM request)
        {
            if (!CepValidation.Validate(request.Cep))
                return Result.Fail("CEP inválido");

            var delivery = _mapper.Map<Delivery>(request);

            await _deliveryRepository.Add(delivery);

            return Result.Ok(delivery);
        }

        public async Task<Result> UpdateDelivery(Guid id, DeliveryVM request)
        {
            if (!CepValidation.Validate(request.Cep))
                return Result.Fail("CPF ou CEP inválidos");

            var existingDelivery = await _deliveryRepository.GetById(id);

            if (existingDelivery == null)
                return Result.Fail("A entrega não existe");

            _mapper.Map(request, existingDelivery);

            await _deliveryRepository.Update(existingDelivery);

            return Result.Ok("Entrega alterada");
        }

        public async Task<DeliveryVM> ViewDeliveryById(Guid id)
        {
            var delivery = await _deliveryRepository.GetById(id);

            var deliveryVM = _mapper.Map<DeliveryVM>(delivery);

            return deliveryVM;
        }

        public async Task<Result> ExcludeDelivery(Guid id)
        {
            await _deliveryRepository.Remove(id);

            return Result.Ok("Entrega deletada");
        }
    }
}

using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Application.Interfaces;
using AccessCorpUsers.Domain.Entities;
using AccessCorpUsers.Domain.Interfaces;
using AccessCorpUsers.Domain.Validations.DocsValidation;
using AccessCorpUsers.Infra.Repositories;
using AutoMapper;

namespace AccessCorpUsers.Application.Services
{
    public class DoormanService : IDoormanService
    {
        private readonly IDoormanRepository _doormanRepository;
        private readonly IAdministratorRepository _administratorRepository;
        private readonly IMapper _mapper;
        private readonly IIdentityApiClient _identityApiClient;

        public DoormanService(IDoormanRepository doormanRepository,
                              IAdministratorRepository administratorRepository,
                              IMapper mapper,
                              IIdentityApiClient identityApiClient)
        {
            _doormanRepository = doormanRepository;
            _administratorRepository = administratorRepository;
            _mapper = mapper;
            _identityApiClient = identityApiClient;
        }

        public async Task<Result> ViewAllDoorman(string email)
        {
            var requestAdmin = await _administratorRepository.GetAdminByEmail(email);

            var doormans = await _doormanRepository.GetDoormanByCep(requestAdmin.Cep);

            var doormanVM = _mapper.Map<List<DoormanVM>>(doormans);

            return Result.Ok(doormanVM);
        }

        public async Task<DoormanVM> ViewDoormanById(Guid id)
        {
            var doorman = await _doormanRepository.GetById(id);

            var doormanVM = _mapper.Map<DoormanVM>(doorman);

            return doormanVM;
        }
        
        public async Task<Result> RegisterDoorman(DoormanVM request)
        {
            if (!CpfValidation.Validate(request.Cpf) || !CepValidation.Validate(request.Cep))
                return Result.Fail("CPF ou CEP inválidos");

            if (_doormanRepository.Find(a => a.Cpf == request.Cpf).Result.Any())
                return Result.Fail("Já existe um adminstrador com esse CPF");

            DoormanIdentityRequest identityRequest = new()
            {
                Id = request.IdentityId,
                Email = request.Email,
                Password = request.Password,
                PasswordConfirmed = request.Password
            };

            var resultRequest = await _identityApiClient.RegisterDoormanAsync(identityRequest);

            if (!resultRequest.IsSuccessStatusCode)
                return Result.Fail($"Erro, {resultRequest.Content}");

            var doorman = _mapper.Map<Doorman>(request);

            await _doormanRepository.Add(doorman);

            return Result.Ok("Usuário cadastrado");
        }

        public async Task<Result> UpdateDoorman(string email, DoormanVM request)
        {
            if (!CpfValidation.Validate(request.Cpf) || !CepValidation.Validate(request.Cep))
                return Result.Fail("CPF ou CEP inválidos");

            DoormanIdentityRequest identityRequest = new()
            {
                Email = request.Email,
                Password = request.Password,
                PasswordConfirmed = request.Password
            };

            var doorman = _mapper.Map<Doorman>(request);

            var doormanExists = await _doormanRepository.GetDoormanByEmail(doorman.Email);

            if (doormanExists == null)
                return Result.Fail("Porteiro iválido");

            doorman.Id = doormanExists.Id;

            var resultRequest = await _identityApiClient.UpdateDoormanAsync(email, identityRequest);

            if (!resultRequest.IsSuccessStatusCode)
                return Result.Fail($"Erro, {resultRequest.Content}");

            await _doormanRepository.Update(doorman);

            return Result.Ok("Usuário alterado");
        }
        public async Task<Result> ExcludeDoorman(string email)
        {
            var doorman = await _doormanRepository.GetDoormanByEmail(email);

            var resultRequest = await _identityApiClient.ExcludeDoormanAsync(email);

            await _doormanRepository.Remove(doorman.Id);

            return Result.Ok("Usúario deletado");
        }
    }
}

using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Application.Interfaces;
using AccessCorpUsers.Domain.Entities;
using AccessCorpUsers.Domain.Interfaces;
using AccessCorpUsers.Domain.Validations.DocsValidation;
using AutoMapper;

namespace AccessCorpUsers.Application.Services
{
    public class AdministratorService : IAdministratorService
    {
        private readonly IAdministratorRepository _administratorRepository;
        private readonly IIdentityApiClient _identityApiClient;
        private readonly IImageService _imageService;
        private readonly IMapper _mapper;

        public AdministratorService(IAdministratorRepository administratorRepository, IIdentityApiClient client, IImageService imageService, IMapper mapper)
        {
            _administratorRepository = administratorRepository;
            _identityApiClient = client;
            _imageService = imageService;
            _mapper = mapper;
        }
        public async Task<Result> ViewAllAdministrators(string email)
        {
            var requestAdmin = await _administratorRepository.GetAdminByEmail(email);

            var administrators = await _administratorRepository.GetAdminsByCep(requestAdmin.Cep);

            var adminVM = _mapper.Map<List<AdministratorVM>>(administrators);

            return Result.Ok(adminVM);
        }

        public async Task<AdministratorVM> ViewAdministratorByEmail(string email)
        {
            var administrators = await _administratorRepository.GetAdminByEmail(email);

            var adminVM = _mapper.Map<AdministratorVM>(administrators);

            return adminVM;
        }

        public async Task<Result> RegisterAdministrator(AdministratorVM request)
        {
            if (!CpfValidation.Validate(request.Cpf) || !CepValidation.Validate(request.Cep))
                return Result.Fail("CPF ou CEP inválidos");

            if (_administratorRepository.Find(a => a.Cpf == request.Cpf).Result.Any())
                return Result.Fail("Já existe um adminstrador com esse CPF");

            AdministratorIdentityRequest identityRequest = new()
            {
                Id = request.IdentityId,
                Email = request.Email,
                Password = request.Password,
                PasswordConfirmed = request.Password
            };

            var resultRequest = await _identityApiClient.RegisterAdministratorAsync(identityRequest);

            if (!resultRequest.IsSuccessStatusCode)
                return Result.Fail($"Erro, {resultRequest.Content}");

            var imageName = Guid.NewGuid() + "_" + request.Image;

            var image = _imageService.UploadFile(request.ImageUpload, imageName);

            if (!image.Success)
                return Result.Fail($"{image.Errors}");

            request.Image = imageName;

            var admin = _mapper.Map<Administrator>(request);

            await _administratorRepository.Add(admin);

            return Result.Ok("Usuário cadastrado");
        }

        public async Task<Result> UpdateAdministrator(string email, AdministratorVM request)
        {
            if (!CpfValidation.Validate(request.Cpf) || !CepValidation.Validate(request.Cep))
                return Result.Fail("CPF ou CEP inválidos");

            AdministratorIdentityRequest identityRequest = new()
            {
                Email = request.Email,
                Password = request.Password,
                PasswordConfirmed = request.Password
            };

            var admin = _mapper.Map<Administrator>(request);

            var adminExists = await _administratorRepository.GetAdminByEmail(admin.Email);

            if (adminExists == null)
                return Result.Fail("Administrador inválido");

            admin.Id = adminExists.Id;

            var resultRequest = await _identityApiClient.UpdateAdministratorAsync(email, identityRequest);

            if (!resultRequest.IsSuccessStatusCode)
                return Result.Fail($"Erro, {resultRequest.Content}");

            await _administratorRepository.Update(admin);

            return Result.Ok("Usuário alterado");
        }

        public async Task<Result> ExcludeAdministrator(string email)
        {
            var admin = await _administratorRepository.GetAdminByEmail(email);
            // TODO padronizar o response no application
            var resultRequest = await _identityApiClient.ExcludeAdministratorAsync(email);
            
            // criar classes para cada request e voltar a fazer as requisições pelo Id
            await _administratorRepository.Remove(admin.Id);

            return Result.Ok("Usúario deletado");
        }

        public void Dispose()
        {
            _administratorRepository.Dispose();
        }

        public async Task<AdministratorVM> GetAdminDoormansResidents(string email)
        {
            var requestAdmin = await _administratorRepository.GetAdminByEmail(email);

            var users = _administratorRepository.GetAdminDoormansResidents(requestAdmin.Cep);

            var adminVM = _mapper.Map<AdministratorVM>(users);

            return adminVM;
        }
    }
}

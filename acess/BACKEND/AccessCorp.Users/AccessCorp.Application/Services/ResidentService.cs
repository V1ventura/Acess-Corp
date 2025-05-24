using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Application.Interfaces;
using AccessCorpUsers.Domain.Entities;
using AccessCorpUsers.Domain.Interfaces;
using AccessCorpUsers.Domain.Validations.DocsValidation;
using AccessCorpUsers.Infra.Repositories;
using AutoMapper;

namespace AccessCorpUsers.Application.Services
{
    public class ResidentService : IResidentService
    {
        private readonly IMapper _mapper;
        private readonly IResidentRepository _residentRepository;
        private readonly IDoormanRepository _doormanRepository;
        private readonly IAdministratorRepository _administratorRepository;
        private readonly IImageService _imageService;

        public ResidentService(IMapper mapper, 
                               IResidentRepository residentRepository,
                               IAdministratorRepository administratorRepository,
                               IImageService imageService,
                               IDoormanRepository doormanRepository)
        {
            _mapper = mapper;
            _residentRepository = residentRepository;
            _administratorRepository = administratorRepository;
            _imageService = imageService;
            _doormanRepository = doormanRepository;
        }

        public async Task<Result> ExcludeResident(string email)
        {
            var resident = await _residentRepository.GetResidentByEmail(email);

            await _residentRepository.Remove(resident.Id);

            return Result.Ok("Usúario deletado");
        }

        public async Task<Result> RegisterResident(ResidentVM request)
        {
            if (!CpfValidation.Validate(request.Cpf) || !CepValidation.Validate(request.Cep))
                return Result.Fail("CPF ou CEP inválidos");

            if (_residentRepository.Find(a => a.Cpf == request.Cpf).Result.Any() ||
                _residentRepository.Find(a => a.Email == request.Email).Result.Any())
                return Result.Fail("Já existe um residente com esse CPF ou email");

            var imageName = Guid.NewGuid() + "_" + request.Image;

            var image = _imageService.UploadFile(request.ImageUpload, imageName);
            
            if (!image.Success)
                return Result.Fail($"{image.Errors}");

            request.Image = imageName;

            var resident = _mapper.Map<Resident>(request);

            await _residentRepository.Add(resident);

            return Result.Ok(resident);
        }

        public async Task<Result> UpdateResident(string email, ResidentVM request)
        {
            if (!CpfValidation.Validate(request.Cpf) || !CepValidation.Validate(request.Cep))
                return Result.Fail("CPF ou CEP inválidos");

            var existingResident = await _residentRepository.GetResidentByEmail(email);

            if (existingResident == null)
                return Result.Fail("Usuário não existe");

            var imageName = Guid.NewGuid() + "_" + request.Image;

            var image = _imageService.UploadFile(request.ImageUpload, imageName);

            if (!image.Success)
                return Result.Fail($"{image.Errors}");

            request.Image = imageName;

            _mapper.Map(request, existingResident);

            await _residentRepository.Update(existingResident);

            return Result.Ok("Usuário alterado");
        }

        public async Task<ResidentVM> ViewResidentById(Guid id)
        {
            var resident = await _residentRepository.GetById(id);

            var residentVM = _mapper.Map<ResidentVM>(resident);

            return residentVM;
        }

        public async Task<Result> ViewAllResidents(string email)
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

            var residents = await _residentRepository.GetResidentsByCep(cep);

            var residentVM = _mapper.Map<List<ResidentVM>>(residents);

            return Result.Ok(residentVM);
        }
    }
}

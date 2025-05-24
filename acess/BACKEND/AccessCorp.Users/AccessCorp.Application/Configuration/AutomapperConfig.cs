using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Domain.Entities;
using AutoMapper;

namespace AccessCorpUsers.Application.Configuration
{
    public  class AutomapperConfig : Profile
    {
        public AutomapperConfig() 
        {
            CreateMap<Administrator, AdministratorVM>()
            .ForMember(dest => dest.Residents, opt => opt.MapFrom(src => (IEnumerable<Resident>?)null))
            .ForMember(dest => dest.Doormans, opt => opt.MapFrom(src => (IEnumerable<Doorman>?)null))
            .ForMember(dest => dest.ImageUpload, opt => opt.MapFrom(src =>
                    src.ImageUpload != null ? Convert.ToBase64String(src.ImageUpload) : null));

            CreateMap<AdministratorVM, Administrator>()
                .ForMember(dest => dest.Residents, opt => opt.Ignore())
                .ForMember(dest => dest.Doormans, opt => opt.Ignore())
                .ForMember(dest => dest.ImageUpload, opt => opt.MapFrom(src =>
                    string.IsNullOrEmpty(src.ImageUpload) ? null : Convert.FromBase64String(src.ImageUpload)));

            CreateMap<Doorman, DoormanVM>().ReverseMap();

            CreateMap<ResidentVM, Resident>()
                .ForMember(dest => dest.ImageUpload, opt => opt.MapFrom(src =>
                    string.IsNullOrEmpty(src.ImageUpload) ? null : Convert.FromBase64String(src.ImageUpload)));

            CreateMap<Resident, ResidentVM>()
                .ForMember(dest => dest.ImageUpload, opt => opt.MapFrom(src =>
                    src.ImageUpload != null ? Convert.ToBase64String(src.ImageUpload) : null));

            CreateMap<Guest, GuestVM>().ReverseMap();

            CreateMap<Delivery, DeliveryVM>().ReverseMap();

        }
    }
}

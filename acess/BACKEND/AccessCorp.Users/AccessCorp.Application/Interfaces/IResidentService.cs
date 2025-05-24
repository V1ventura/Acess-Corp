using AccessCorpUsers.Application.Entities;

namespace AccessCorpUsers.Application.Interfaces
{
    public interface IResidentService
    {
        public Task<Result> ViewAllResidents(string email);
        public Task<ResidentVM> ViewResidentById(Guid id);
        public Task<Result> RegisterResident(ResidentVM request);
        public Task<Result> UpdateResident(string email, ResidentVM request);
        public Task<Result> ExcludeResident(string email);
    }
}

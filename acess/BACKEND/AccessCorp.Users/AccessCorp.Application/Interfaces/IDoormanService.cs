using AccessCorpUsers.Application.Entities;

namespace AccessCorpUsers.Application.Interfaces
{
    public interface IDoormanService
    {
        public Task<Result> ViewAllDoorman(string email);
        public Task<DoormanVM> ViewDoormanById(Guid id);
        public Task<Result> RegisterDoorman(DoormanVM request);
        public Task<Result> UpdateDoorman(string email, DoormanVM request);
        public Task<Result> ExcludeDoorman(string email);
    }
}

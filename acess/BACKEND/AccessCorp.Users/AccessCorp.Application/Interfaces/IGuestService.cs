using AccessCorpUsers.Application.Entities;

namespace AccessCorpUsers.Application.Interfaces
{
    public interface IGuestService
    {
        public Task<Result> ViewAllGuests(string email);
        public Task<GuestVM> ViewGuestById(Guid id);
        public Task<Result> RegisterGuest(GuestVM request);
        public Task<Result> UpdateGuest(string email, GuestVM request);
        public Task<Result> ExcludeGuest(string email);
        public Task<Result> GenerateQrCodeForGuest(string email);
    }
}

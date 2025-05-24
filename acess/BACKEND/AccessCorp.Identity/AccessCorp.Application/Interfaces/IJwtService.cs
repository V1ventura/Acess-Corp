using AccessCorp.Application.Entities;

namespace AccessCorp.Application.Interfaces;

public interface IJwtService
{
    public Task<AdministratorResponseVM> GenerateJWTAdmin(string email);
    public Task<DoormanResponseVM> GenerateJWTDoorman(string email);
}
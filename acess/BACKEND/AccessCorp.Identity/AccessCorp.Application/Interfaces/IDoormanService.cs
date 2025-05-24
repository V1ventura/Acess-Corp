using AccessCorp.Application.Entities;

namespace AccessCorp.Application.Interfaces;

public interface IDoormanService
{
    public Task<Result> ViewDoorman(string id);
    public Task<Result> RegisterDoorman(DoormanRegisterVM request);
    public Task<Result> EditDoorman(string id,DoormanUpdateVM request);
    public Task<Result> ExcludeDoorman(string id);
}
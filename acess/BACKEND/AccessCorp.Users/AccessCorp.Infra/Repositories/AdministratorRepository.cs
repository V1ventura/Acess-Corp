using AccessCorpUsers.Domain.Entities;
using AccessCorpUsers.Domain.Interfaces;
using AccessCorpUsers.Infra.Context;
using Microsoft.EntityFrameworkCore;

namespace AccessCorpUsers.Infra.Repositories;

public class AdministratorRepository : Repository<Administrator>, IAdministratorRepository
{
    public AdministratorRepository(AccessCorpUsersDbContext context) : base(context) { }

    public async Task<Administrator> GetAdminByEmail(string email)
    {
        var admin = await Find(a => a.Email == email);

        return admin.FirstOrDefault();
    }
    public async Task<IEnumerable<Administrator>> GetAdminsByCep(string cep)
    {
        return await Find(d => d.Cep == cep);
    }

    public async Task<Administrator> GetAdminDoormansResidents(string cep)
    {
        return await _context.Administrators.AsNoTracking()
            .Include(a => a.Doormans)
            .Include(a => a.Residents)
            .FirstOrDefaultAsync(a => a.Cep == cep);
    }
}
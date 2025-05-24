using AccessCorpUsers.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AccessCorpUsers.Infra.Context;

public class AccessCorpUsersDbContext : DbContext
{
    public AccessCorpUsersDbContext(DbContextOptions<AccessCorpUsersDbContext> options) : base(options) 
    {
    }

    public virtual DbSet<Administrator> Administrators { get; set; }
    public virtual DbSet<Doorman> Doormans { get; set; }
    public virtual DbSet<Guest> Guests { get; set; }
    public virtual DbSet<Resident> Residents { get; set; }
    public virtual DbSet<Delivery> Deliveries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AccessCorpUsersDbContext).Assembly);
        
        base.OnModelCreating(modelBuilder);
    }
}
namespace AccessCorpUsers.Domain.Entities;

public class Administrator : Entity
{
    public string Name { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Cpf { get; set; }
    public string Cep { get; set; }
    public int HouseNumber { get; set; }
    public string Password { get; set; }
    public string Image { get; set; }
    public byte[] ImageUpload { get; set; }
    public IEnumerable<Doorman>? Doormans { get; set; }
    public IEnumerable<Resident>? Residents { get; set; }
    public Guid IdentityId { get; set; }

    public Administrator()
    {
        IdentityId = Id;
    }
}

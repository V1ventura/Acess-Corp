namespace AccessCorpUsers.Domain.Entities;

public class Resident : Entity
{
    public string Name { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string Phone { get; set; }
    public string Cpf { get; set; }
    public string Cep { get; set; }
    public string Image { get; set; }
    public byte[] ImageUpload { get; set; }
    public int HouseNumber { get; set; }
}
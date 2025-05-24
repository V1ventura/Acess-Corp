namespace AccessCorp.Application.Entities;

public class AdministratorResponseVM
{
    /// <summary>
    /// Token de acesso 
    /// </summary>
    public string AccessToken { get; set; }
    
    /// <summary>
    /// Expiração do token
    /// </summary>
    public double ExpiresIn { get; set; }
    
    /// <summary>
    /// Dado do usario que está logado dentro do token
    /// </summary>
    public AdministratorToken AdministratorToken { get; set; }
}

public class AdministratorToken
{
    public string Id { get; set; }
    public string Email { get; set; }
    public IEnumerable<AdministratorClaim> Claims { get; set; }
}

public class AdministratorClaim
{
    public string Value { get; set; }
    public string Type { get; set; }
}
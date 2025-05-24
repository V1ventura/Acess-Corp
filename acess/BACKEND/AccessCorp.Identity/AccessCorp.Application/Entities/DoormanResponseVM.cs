namespace AccessCorp.Application.Entities;

public class DoormanResponseVM
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
    public DoormanToken DoormanToken { get; set; }
}

public class DoormanToken
{
    public string Id { get; set; }
    public string Email { get; set; }
    public IEnumerable<DoormanClaim> Claims { get; set; }
}

public class DoormanClaim
{
    public string Value { get; set; }
    public string Type { get; set; }
}
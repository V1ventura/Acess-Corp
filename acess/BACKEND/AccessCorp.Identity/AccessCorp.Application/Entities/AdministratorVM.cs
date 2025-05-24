using System.ComponentModel.DataAnnotations;

namespace AccessCorp.Application.Entities;

public class AdministratorRegisterVM
{
    [Key]
    public string Id { get; set; }

    [Required(ErrorMessage = "O campo {0} é obrigatório ")]
    [EmailAddress(ErrorMessage = "O campo {0} está em formato inválido")]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "O campo {0} é obrigatório ")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "O campo {0} precisa ter entre {2} e {1} caracteres")]
    public string Password { get; set; }
    
    [Compare("Password", ErrorMessage = "As senhas não conferem")]
    public string PasswordConfirmed { get; set; }
}

public class AdministratorFirstAccessVM
{
    [Required(ErrorMessage = "O campo {0} é obrigatório ")]
    [EmailAddress(ErrorMessage = "O campo {0} está em formato inválido")]
    public string Email { get; set; }
}

public class AdministratorResetPasswordVM
{
    [Required(ErrorMessage = "O campo {0} é obrigatório ")]
    [EmailAddress(ErrorMessage = "O campo {0} está em formato inválido")]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "O campo {0} é obrigatório!")]    
    public string Token { get; set; }
    
    [Required(ErrorMessage = "O campo {0} é obrigatório ")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "O campo {0} precisa ter entre {2} e {1} caracteres")]
    public string Password { get; set; }
    
    [Compare("Password", ErrorMessage = "As senhas não conferem")]
    public string PasswordConfirmed { get; set; }
}

public class AdministratorLoginVM
{
    [Required(ErrorMessage = "O campo {0} é obrigatório ")]
    [EmailAddress(ErrorMessage = "O campo {0} está em formato inválido")]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "O campo {0} é obrigatório ")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "O campo {0} precisa ter entre {2} e {1} caracteres")]
    public string Password { get; set; } 
}

public class AdministratorUpdateVM
{
    [Required(ErrorMessage = "O campo {0} é obrigatório ")]
    [EmailAddress(ErrorMessage = "O campo {0} está em formato inválido")]
    public string Email { get; set; }
    
    [Required(ErrorMessage = "O campo {0} é obrigatório ")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "O campo {0} precisa ter entre {2} e {1} caracteres")]
    public string Password { get; set; }
}
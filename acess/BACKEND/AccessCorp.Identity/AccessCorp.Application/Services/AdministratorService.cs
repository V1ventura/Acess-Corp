using AccessCorp.Application.Entities;
using AccessCorp.Application.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace AccessCorp.Application.Services;

public class AdministratorService : IAdministratorService
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    
    public AdministratorService(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }
    
    public async Task<Result> ViewAdministrator(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        
        if (user == null) return Result.Fail("User not found");

        return Result.Ok(user);
    }
    
    public async Task<Result> EditAdministrator(string email, AdministratorUpdateVM request)
    {
        //TODO fazer validação
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null) return Result.Fail("Usuário não encontrado");

        user.Email = request.Email;
        user.UserName = request.Email;

        if (!string.IsNullOrWhiteSpace(request.Password))
        {
            var userHasPassword = await _userManager.HasPasswordAsync(user);

            if (userHasPassword)
            {
                var removePasswordResult = await _userManager.RemovePasswordAsync(user);
                if (!removePasswordResult.Succeeded)
                {
                    return Result.Fail("Erro ao remover a senha: " + string.Join(", ", removePasswordResult.Errors.Select(e => e.Description)));
                }
            }

            var addPasswordResult = await _userManager.AddPasswordAsync(user, request.Password);
            
            if (!addPasswordResult.Succeeded)
            {
                return Result.Fail("Erro ao adicionar nova senha: " + string.Join(", ", addPasswordResult.Errors.Select(e => e.Description)));
            }
        }

        var result = await _userManager.UpdateAsync(user);

        return result.Succeeded ? Result.Ok("Usuário alterado com sucesso") : Result.Fail("Erro ao alterar usuário");
    }

    public async Task<Result> ExcludeAdministrator(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        
        if (user == null) return Result.Fail("User not found");
        
        var result = await _userManager.DeleteAsync(user);

        if (result.Succeeded) return Result.Ok("usuário removido");
        
        var errors = result.Errors.Select(e => e.Description).ToList();
        return Result.Fail(errors);
    }
}
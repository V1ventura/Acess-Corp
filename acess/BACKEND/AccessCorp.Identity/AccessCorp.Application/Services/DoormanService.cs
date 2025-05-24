using AccessCorp.Application.Entities;
using AccessCorp.Application.Interfaces;
using AccessCorp.Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace AccessCorp.Application.Services;

public class DoormanService : IDoormanService
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IJwtService _jwtService;
    private readonly IUserClaimsService _userClaimsService;

    public DoormanService(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager,
                          IJwtService jwtService, IUserClaimsService userClaimsService)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _jwtService = jwtService;
        _userClaimsService = userClaimsService;
    }
    
    public async Task<Result> ViewDoorman(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        
        if (user == null) return Result.Fail("User not found");

        return Result.Ok(user);
    }

    public async Task<Result> RegisterDoorman(DoormanRegisterVM request)
    {
        var user = new IdentityUser
        {
            Id = request.Id,
            UserName = request.Email,
            Email = request.Email,
            EmailConfirmed = true
        };
            
        var result = await _userManager.CreateAsync(user, request.Password);
    
        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description).ToList();
            return Result.Fail(errors);
        }
        
        await _userClaimsService.AddPermissionClaimAsync(user, "LimitedAccess");
        await _signInManager.SignInAsync(user, false);
        
        return Result.Ok(await _jwtService.GenerateJWTAdmin(user.Email));
    }
    
    public async Task<Result> EditDoorman(string email, DoormanUpdateVM request)
    {
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

    public async Task<Result> ExcludeDoorman(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        
        if (user == null) return Result.Fail("User not found");
        
        var result = await _userManager.DeleteAsync(user);

        if (result.Succeeded) return Result.Ok("usuário removido");
        
        var errors = result.Errors.Select(e => e.Description).ToList();
        return Result.Fail(errors);    }
}
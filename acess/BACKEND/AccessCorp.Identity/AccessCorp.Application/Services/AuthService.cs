using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AccessCorp.Application.Entities;
using AccessCorp.Application.Interfaces;
using AccessCorp.Domain.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;


namespace AccessCorp.Application.Services;

public class AuthService : IAuthService
{
    private readonly SignInManager<IdentityUser> _signInManager;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ICepValidationService _cepValidationService;
    private readonly IJwtService _jwtService;
    private readonly IUserClaimsService _userClaimsService;
    private readonly ISendEmailService _sendEmailService;
    
    public AuthService(SignInManager<IdentityUser> signInManager, 
                       UserManager<IdentityUser> userManager,
                       ICepValidationService cepValidationService,
                       IJwtService jwtService,
                       IUserClaimsService userClaimsService,
                       ISendEmailService sendEmailService)
    {
        _signInManager = signInManager;
        _userManager = userManager;
        _cepValidationService = cepValidationService;
        _jwtService = jwtService;
        _userClaimsService = userClaimsService;
        _sendEmailService = sendEmailService;
    }

    public async Task<Result> LoginAdministrator(AdministratorLoginVM request)
    {
        if (!await _userClaimsService.HasAdmimClaims(request.Email)) return Result.Fail("Usuário ou Password incorretos");
       
        var result = await _signInManager.PasswordSignInAsync(request.Email, request.Password, false, true);

        if (result.Succeeded)
            return Result.Ok(await _jwtService.GenerateJWTAdmin(request.Email));

        return Result.Fail(result.IsLockedOut ? "Usuário temporariamente bloqueados por tentativas inválidas." : "Usuário ou Password incorretos");
    }

    public async Task<Result> RegisterAdministrator(AdministratorRegisterVM request)
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
        
        await _userClaimsService.AddPermissionClaimAsync(user, "FullAccess");
        await _signInManager.SignInAsync(user, false);
        
        return Result.Ok(await _jwtService.GenerateJWTAdmin(user.Email));
    }

    public async Task<Result> FirsAccessAdministrator(AdministratorFirstAccessVM request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        
        if (user == null) return Result.Fail("Usuario incorreto");

        if (!await _userClaimsService.HasAdmimClaims(request.Email))
            return Result.Fail("Usuário incorreto");

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        
        var result = _sendEmailService.SendEmail(request.Email, token);

        if (!await result)
        {
            return Result.Fail("Houve um erro");
        }
        
        return Result.Ok("E-mail enviado.");
    }

    public async Task<Result> ResetPasswordAdministrator(AdministratorResetPasswordVM request)
    {      
        var user = await _userManager.FindByEmailAsync(request.Email);
        
        if (user == null) return Result.Fail("Usuario incorreto");
        
        var result = await _userManager.ResetPasswordAsync(user, request.Token, request.Password);

        return result.Succeeded ? Result.Ok(await _jwtService.GenerateJWTAdmin(user.Email)) : Result.Fail("Email ou token incorreto");
    }

    public async Task<Result> LoginDoorman(DoormanLoginVM request)
    {
        if (!await _userClaimsService.HasDoormanClaims(request.Email))
            return Result.Fail("Usuário ou Password incorretos");
        
        var result = await _signInManager.PasswordSignInAsync(request.Email, request.Password, false, true);
    
        if (result.Succeeded)
            return Result.Ok(await _jwtService.GenerateJWTDoorman(request.Email));

        return Result.Fail(result.IsLockedOut ? "Usuário temporariamente bloqueados por tentativas inválidas." : "Usuário ou Password incorretos");
    }


    private bool ValidateCep(string cep)
    {
        if (!_cepValidationService.CepIsValid(cep)) return false;

        return true;
    }
}
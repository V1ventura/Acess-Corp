using AccessCorp.Application.Entities;
using AccessCorp.Application.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace AccessCorp.WebApi.Controllers;

[ApiVersion("1.0")]
[Route("identity/v1")]
public class AuthController : MainController
{
    private readonly IAuthService _authService;
    
    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }
    
    [HttpPost("login-administrator")]
    [ProducesResponseType<ActionResult>(400)]
    [ProducesResponseType<ActionResult>(200)]
    public async Task<ActionResult> Login([FromBody] AdministratorLoginVM request)
    {
        if (!ModelState.IsValid) return CustomResponse(ModelState);
        
        var result = await _authService.LoginAdministrator(request);

        if (result.Success) return CustomResponse(result);
        
        foreach (var error in result.Errors)
        {
            AddErrorProcess(error);
        }
            
        return CustomResponse();
    }
    
    [HttpPost("first-access-administrator")]
    [ProducesResponseType<ActionResult>(400)]
    [ProducesResponseType<ActionResult>(200)]
    public async Task<ActionResult> FirsAccessAdministrator([FromBody] AdministratorFirstAccessVM request)
    {
        if (!ModelState.IsValid) return CustomResponse(ModelState);
        
        var result = await _authService.FirsAccessAdministrator(request);
      
        if (result.Success) return CustomResponse(result);
        
        foreach (var error in result.Errors)
        {
            AddErrorProcess(error);
        }
            
        return CustomResponse();
    }

    [HttpPost("reset-password-administrator")]
    [ProducesResponseType<ActionResult>(400)]
    [ProducesResponseType<ActionResult>(200)]
    public async Task<ActionResult> ResetPasswordAdministrator([FromBody] AdministratorResetPasswordVM request)
    {
        if (!ModelState.IsValid) return CustomResponse(ModelState);
        
        var result = await _authService.ResetPasswordAdministrator(request);
      
        if (result.Success) return CustomResponse(result);
        
        foreach (var error in result.Errors)
        {
            AddErrorProcess(error);
        }
            
        return CustomResponse();
    }
    
    [HttpPost("login-doorman")]
    [ProducesResponseType<ActionResult>(400)]
    [ProducesResponseType<ActionResult>(200)]
    public async Task<ActionResult> Login([FromBody] DoormanLoginVM request)
    {
        if (!ModelState.IsValid) return CustomResponse(ModelState);
        
        var result = await _authService.LoginDoorman(request);

        if (result.Success) return CustomResponse(result);
        
        foreach (var error in result.Errors)
        {
            AddErrorProcess(error);
        }
            
        return CustomResponse();
    }
   }
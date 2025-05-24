using AccessCorp.Application.Entities;
using AccessCorp.Application.Interfaces;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AccessCorp.WebApi.Controllers;

[ApiVersion("1.0")]
[Authorize("AdminPolicy"), Route("identity/v1/administrator")]
public class AdministratorController : MainController
{
    private readonly IAuthService _authService;
    private readonly IAdministratorService _administratorService;

    public AdministratorController(IAuthService authService, IAdministratorService administratorService)
    {
        _authService = authService;
        _administratorService = administratorService;
    }
    
    [HttpGet("view/{email}")] 
    [ProducesResponseType<ActionResult>(400)]
    [ProducesResponseType<ActionResult>(401)]
    [ProducesResponseType<ActionResult>(200)]
    public async Task<ActionResult> GetAdministratorByEmail(string email)
    {
        var result = await _administratorService.ViewAdministrator(email);
        
        if (result.Success) return CustomResponse(result);
        
        foreach (var error in result.Errors)
        {
            AddErrorProcess(error);
        }
            
        return CustomResponse();
    }
    
    [HttpPost("register")]
    [ProducesResponseType<ActionResult>(400)]
    [ProducesResponseType<ActionResult>(401)]
    [ProducesResponseType<ActionResult>(200)]
    public async Task<ActionResult> PostAdministrator([FromBody] AdministratorRegisterVM request)
    {
        if (!ModelState.IsValid) return CustomResponse(ModelState);
    
        var result = await _authService.RegisterAdministrator(request);
        
        if (result.Success) return CustomResponse(result);
        
        foreach (var error in result.Errors)
        {
            AddErrorProcess(error);
        }
            
        return CustomResponse();
    }
    
    [HttpPut("update/{email}")]
    [ProducesResponseType<ActionResult>(400)]
    [ProducesResponseType<ActionResult>(401)]
    [ProducesResponseType<ActionResult>(200)]
    public async Task<ActionResult> PutAdministrator(string email ,[FromBody] AdministratorUpdateVM request)
    {
        if (!ModelState.IsValid) return CustomResponse(ModelState);
    
        var result = await _administratorService.EditAdministrator(email, request);
        
        if (result.Success) return CustomResponse(result);
        
        foreach (var error in result.Errors)
        {
            AddErrorProcess(error);
        }
            
        return CustomResponse();
    }
    
    [HttpDelete("exclude/{email}")]
    [ProducesResponseType<ActionResult>(400)]
    [ProducesResponseType<ActionResult>(401)]
    [ProducesResponseType<ActionResult>(200)]
    public async Task<ActionResult> DeleteAdministrator(string email)
    {
        var result = await _administratorService.ExcludeAdministrator(email);
        
        if (result.Success) return CustomResponse(result);
        
        foreach (var error in result.Errors)
        {
            AddErrorProcess(error);
        }
            
        return CustomResponse();
    }
    
}
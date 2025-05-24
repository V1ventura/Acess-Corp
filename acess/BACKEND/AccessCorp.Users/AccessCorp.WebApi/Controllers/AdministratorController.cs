using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Application.Interfaces;
using AccessCorpUsers.WebApi.Extensions;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace AccessCorpUsers.WebApi.Controllers;

[ApiVersion("1.0")]
[ClaimsAuthorize("Permission", "FullAccess"), Route("users/v1/administrator")]
public class AdministratorController : MainController
{
    private readonly IAdministratorService _administratorService;

    public AdministratorController(IAdministratorService administratorService)
    {
        _administratorService = administratorService;
    }

  
    [HttpGet("view-all")]
    public async Task<ActionResult<List<AdministratorVM>>> GetAllAdministrators()
    {
        var userId = GetUserId(HttpContext.User);
        var result = await _administratorService.ViewAllAdministrators(userId.email);

        if (result == null)
            return CustomResponse();

        return CustomResponse(result);
    }

 
    [HttpGet("view/{email}")]
    public async Task<ActionResult<AdministratorVM>> GetAdministratorById(string email)
    {
        var result = await _administratorService.ViewAdministratorByEmail(email);

        if (result == null)
            return CustomResponse();

        return CustomResponse(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult> PostAdministrator([FromBody] AdministratorVM request)
    {
        if (!ModelState.IsValid)
            return CustomResponse(ModelState);

        var result = await _administratorService.RegisterAdministrator(request);

        if (result.Success) return CustomResponse(result);

        foreach (var error in result.Errors)
        {
            AddErrorProcess(error);
        }

        return CustomResponse();
    }

    [HttpPut("update/{email}")]
    public async Task<ActionResult> PutAdministrator(string email, [FromBody] AdministratorVM request)
    {
        //if (id != request.Id)
        //    return CustomResponse();

        if (!ModelState.IsValid)
            return CustomResponse(ModelState);

        var result = await _administratorService.UpdateAdministrator(email, request);

        if (result.Success) return CustomResponse(result);

        foreach (var error in result.Errors)
        {
            AddErrorProcess(error);
        }

        return CustomResponse();
    }

    [HttpDelete("exclude/{email}")]
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

    [HttpGet("view-all-users")]
    public async Task<ActionResult> ViewAllUsersByAdmin()
    {
        var userId = GetUserId(HttpContext.User);

        if (userId.email != null && userId.userId != null)
        {
            var result = await _administratorService.GetAdminDoormansResidents(userId.email);

            return CustomResponse(result);
        }

        return CustomResponse(ModelState);
    }
}
using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Application.Interfaces;
using AccessCorpUsers.WebApi.Extensions;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AccessCorpUsers.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [Authorize, Route("users/v1/doorman")]
    public class DoormanController : MainController
    {
        private readonly IDoormanService _doormanService;
        public DoormanController(IDoormanService doormanService, IResidentService residentService)
        {
            _doormanService = doormanService;
        }

        [HttpGet("view-all")]
        [ClaimsAuthorize("Permission", "FullAccess")]
        public async Task<ActionResult<List<DoormanVM>>> GetAllDoorman()
        {
            var userId = GetUserId(HttpContext.User);

            var result = await _doormanService.ViewAllDoorman(userId.email);

            if (result == null)
                return CustomResponse();

            return CustomResponse(result);
        }

        [HttpGet("view/{id}")]
        public async Task<ActionResult<DoormanVM>> GetDoormanById(Guid id)
        {
            var result = await _doormanService.ViewDoormanById(id);

            if (result == null)
                return CustomResponse();

            return CustomResponse(result);
        }

        [HttpPost("register")]
        [ClaimsAuthorize("Permission", "FullAccess")]
        public async Task<ActionResult> PostDoorman([FromBody] DoormanVM request)
        {
            if (!ModelState.IsValid)
                return CustomResponse(ModelState);

            var result = await _doormanService.RegisterDoorman(request);

            if (result.Success) return CustomResponse(result);

            foreach (var error in result.Errors)
            {
                AddErrorProcess(error);
            }

            return CustomResponse(result);
        }

        [HttpPut("update/{email}")]
        [ClaimsAuthorize("Permission", "FullAccess")]
        public async Task<ActionResult> PutDoorman(string email, [FromBody] DoormanVM request)
        {
            //if (id != request.Id)
            //    return CustomResponse();

            if (!ModelState.IsValid)
                return CustomResponse(ModelState);

            var result = await _doormanService.UpdateDoorman(email, request);

            if (result.Success) return CustomResponse(result);

            foreach (var error in result.Errors)
            {
                AddErrorProcess(error);
            }

            return CustomResponse(result);
        }

        [HttpDelete("exclude/{email}")]
        [ClaimsAuthorize("Permission", "FullAccess")]
        public async Task<ActionResult> DeleteDoorman(string email)
        {
            var result = await _doormanService.ExcludeDoorman(email);

            if (result.Success) return CustomResponse(result);

            foreach (var error in result.Errors)
            {
                AddErrorProcess(error);
            }

            return CustomResponse(result);
        }
    }
}

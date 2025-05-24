using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Application.Interfaces;
using AccessCorpUsers.WebApi.Extensions;
using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

namespace AccessCorpUsers.WebApi.Controllers
{
    [ApiVersion("1.0")]
    [ClaimsAuthorize("Permission", "LimitedAccess"), Route("users/v1/guests")]
    public class GuestController : MainController
    {
        private readonly IGuestService _guestService;

        public GuestController(IGuestService guestService)
        {
            _guestService = guestService;
        }

        [HttpGet("view-all")]
        public async Task<ActionResult<GuestVM>> ViewAllGuest()
        {
            var userId = GetUserId(HttpContext.User);
            var result = await _guestService.ViewAllGuests(userId.email);

            if (result == null)
                return CustomResponse();

            return CustomResponse(result);
        }

        [HttpGet("view/{id}")]
        public async Task<ActionResult<GuestVM>> ViewGuestById(Guid id)
        {
            var result = await _guestService.ViewGuestById(id);

            if (result == null)
                return CustomResponse();

            return CustomResponse(result);
        }

        [HttpPost("register")]
        public async Task<ActionResult<GuestVM>> RegisterGuest([FromBody] GuestVM request)
        {
            if (!ModelState.IsValid)
                return CustomResponse(ModelState);

            var result = await _guestService.RegisterGuest(request);

            if (result.Success) return CustomResponse(result);

            foreach (var error in result.Errors)
            {
                AddErrorProcess(error);
            }

            return CustomResponse();
        }

        [HttpPut("update/{email}")]
        public async Task<ActionResult<GuestVM>> UpdateGuest(string email, [FromBody] GuestVM request)
        {
            if (!ModelState.IsValid)
                return CustomResponse(ModelState);

            var result = await _guestService.UpdateGuest(email, request);

            if (result.Success) return CustomResponse(result);

            foreach (var error in result.Errors)
            {
                AddErrorProcess(error);
            }

            return CustomResponse();
        }

        [HttpDelete("exclude/{email}")]
        public async Task<ActionResult<GuestVM>> ExcludeGuest(string email)
        {
            var result = await _guestService.ExcludeGuest(email);

            if (result.Success) return CustomResponse(result);

            foreach (var error in result.Errors)
            {
                AddErrorProcess(error);
            }

            return CustomResponse();
        }

        [HttpGet("{email}/new-qrcode")]
        public async Task<ActionResult> GenerateQrCode(string email)
        {
            var result = await _guestService.GenerateQrCodeForGuest(email);

            if (result.Success) return CustomResponse(result);

            foreach (var error in result.Errors)
            {
                AddErrorProcess(error);
            }

            return CustomResponse();
        }
    }
}

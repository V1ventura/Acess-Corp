using AccessCorpUsers.Application.Entities;
using AccessCorpUsers.Application.Interfaces;
using AccessCorpUsers.Application.Services;
using AccessCorpUsers.WebApi.Extensions;
using Asp.Versioning;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AccessCorpUsers.WebApi.Controllers
{

    [ApiVersion("1.0")]
    [Authorize, Route("users/v1/delivery")]
    public class DeliveryController : MainController
    {
        private readonly IDeliveryService _deliveryService;

        public DeliveryController(IDeliveryService deliveryService)
        {
            _deliveryService = deliveryService;   
        }

        [HttpGet("view-all")]
        public async Task<ActionResult<List<DeliveryVM>>> GetAllDeliveries()
        {
            var userId = GetUserId(HttpContext.User);
            
            var result = await _deliveryService.ViewAllDeliveries(userId.email);

            if (result == null)
                return CustomResponse();

            return CustomResponse(result);
        }


        [HttpGet("view/{id}")]
        public async Task<ActionResult<DeliveryVM>> GetDeliveryById(Guid id)
        {
            var result = await _deliveryService.ViewDeliveryById(id);

            if (result == null)
                return CustomResponse();

            return CustomResponse(result);
        }

        [HttpPost("register")]
        public async Task<ActionResult> PostDelivery([FromBody] DeliveryVM request)
        {
            if (!ModelState.IsValid)
                return CustomResponse(ModelState);

            var result = await _deliveryService.RegisterDelivery(request);

            if (result.Success) return CustomResponse(result);

            foreach (var error in result.Errors)
            {
                AddErrorProcess(error);
            }

            return CustomResponse();
        }

        [HttpPut("update/{id}")]
        public async Task<ActionResult> PutDelivery(Guid id, [FromBody] DeliveryVM request)
        {
            //if (id != request.Id)
            //    return CustomResponse();

            if (!ModelState.IsValid)
                return CustomResponse(ModelState);

            var result = await _deliveryService.UpdateDelivery(id, request);

            if (result.Success) return CustomResponse(result);

            foreach (var error in result.Errors)
            {
                AddErrorProcess(error);
            }

            return CustomResponse();
        }

        [HttpDelete("exclude/{id}")]
        public async Task<ActionResult> DeleteDelivery(Guid id)
        {
            var result = await _deliveryService.ExcludeDelivery(id);

            if (result.Success) return CustomResponse(result);

            foreach (var error in result.Errors)
            {
                AddErrorProcess(error);
            }

            return CustomResponse();
        }
    }
}

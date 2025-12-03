// Controllers/BaseApiController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace IdeaHub.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BaseApiController : ControllerBase
    {
        protected string UserId => User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        protected string UserEmail => User.FindFirst(ClaimTypes.Email)?.Value;
    }
}

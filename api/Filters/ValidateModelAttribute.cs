// Filters/ValidateModelAttribute.cs
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using IdeaHub.Models;

namespace IdeaHub.Filters
{
    public class ValidateModelAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errors = context.ModelState
                    .Where(x => x.Value.Errors.Count > 0)
                    .ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.Errors.Select(e => e.ErrorMessage).ToArray()
                    );

                var response = new ApiResponse<object>
                {
                    Success = false,
                    Message = "Validation failed",
                    Errors = errors.Values.SelectMany(e => e).ToList()
                };

                context.Result = new BadRequestObjectResult(response);
            }
        }
    }
}
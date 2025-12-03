// In Middleware/RequestLoggingMiddleware.cs
public class RequestResponseLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestResponseLoggingMiddleware> _logger;

    public RequestResponseLoggingMiddleware(RequestDelegate next, ILogger<RequestResponseLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Log the request
        await LogRequest(context.Request);

        // Copy the original response body stream
        var originalBodyStream = context.Response.Body;

        // Create a new memory stream for the response
        using (var responseBody = new MemoryStream())
        {
            // Replace the response body with our memory stream
            context.Response.Body = responseBody;

            // Call the next middleware in the pipeline
            await _next(context);

            // Log the response
            await LogResponse(context.Response);

            // Copy the memory stream to the original stream
            await responseBody.CopyToAsync(originalBodyStream);
        }
    }

    private async Task LogRequest(HttpRequest request)
    {
        request.EnableBuffering();

        var requestLog = new
        {
            Path = request.Path,
            Method = request.Method,
            QueryString = request.QueryString,
            Headers = request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()),
            Body = await new StreamReader(request.Body).ReadToEndAsync()
        };

        _logger.LogInformation("Request: {@Request}", requestLog);

        // Reset the request body stream position so the next middleware can read it
        request.Body.Position = 0;
    }

    private async Task LogResponse(HttpResponse response)
    {
        response.Body.Seek(0, SeekOrigin.Begin);
        var text = await new StreamReader(response.Body).ReadToEndAsync();
        response.Body.Seek(0, SeekOrigin.Begin);

        var responseLog = new
        {
            StatusCode = response.StatusCode,
            ContentType = response.ContentType,
            Headers = response.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()),
            Body = text
        };

        _logger.LogInformation("Response: {@Response}", responseLog);
    }
}

// Remove this line as it's causing the error
// app.UseMiddleware<RequestResponseLoggingMiddleware>();
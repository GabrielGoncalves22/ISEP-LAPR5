using System.IdentityModel.Tokens.Jwt;

namespace MDT.Middlewares;

public class AttachCurrentUserMiddleware
{
    private readonly RequestDelegate _next;

    public AttachCurrentUserMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        var decodedToken = context.Items["DecodedToken"] as JwtSecurityToken;

        if (decodedToken == null || IsTokenExpired(decodedToken.ValidTo))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Non-existent or invalid token!");
            return;
        }

        context.Items["UserId"] = decodedToken.Claims.FirstOrDefault(c => c.Type == "id")?.Value;
        context.Items["UserName"] = decodedToken.Claims.FirstOrDefault(c => c.Type == "name")?.Value;
        context.Items["UserEmail"] = decodedToken.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

        await _next(context);
    }

    private static bool IsTokenExpired(DateTime validTo)
    {
        return validTo != DateTime.MinValue && validTo < DateTime.UtcNow;
    }
}

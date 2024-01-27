using System.IdentityModel.Tokens.Jwt;

namespace MDT.Middlewares;

public class VerifyUserRoleMiddleware
{
    private readonly RequestDelegate _next;
    private readonly string _requiredRole;

    public VerifyUserRoleMiddleware(RequestDelegate next, string requiredRole)
    {
        _next = next;
        _requiredRole = requiredRole;
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

        var userRole = decodedToken.Claims.FirstOrDefault(c => c.Type == "role")?.Value;

        if (userRole != _requiredRole)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("The user does not have the required permissions!");
            return;
        }

        await _next(context);
    }

    private static bool IsTokenExpired(DateTime validTo)
    {
        return validTo != DateTime.MinValue && validTo < DateTime.UtcNow;
    }

    public static Func<HttpContext, Task> VerifyRoleSystemManager =>
    new VerifyUserRoleMiddleware(_ => Task.CompletedTask, "System Manager").Invoke;

    public static Func<HttpContext, Task> VerifyRoleCampusManager =>
        new VerifyUserRoleMiddleware(_ => Task.CompletedTask, "Campus Manager").Invoke;

    public static Func<HttpContext, Task> VerifyRoleFleetManager =>
        new VerifyUserRoleMiddleware(_ => Task.CompletedTask, "Fleet Manager").Invoke;

    public static Func<HttpContext, Task> VerifyRoleTaskManager =>
        new VerifyUserRoleMiddleware(_ => Task.CompletedTask, "Task manager").Invoke;

    public static Func<HttpContext, Task> VerifyRoleUser =>
        new VerifyUserRoleMiddleware(_ => Task.CompletedTask, "User").Invoke;
}

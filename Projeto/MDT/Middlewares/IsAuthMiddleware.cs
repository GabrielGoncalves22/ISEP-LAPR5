using System.IdentityModel.Tokens.Jwt;

namespace MDT.Middlewares;

public class IsAuthMiddleware
{
    private readonly RequestDelegate _next;
    private static string? _token;

    public IsAuthMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        _token = GetTokenFromHeader(context.Request);

        if (string.IsNullOrEmpty(_token))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Token not provided!");
            return;
        }

        var decodedToken = DecodeJwtToken();

        if (decodedToken == null)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync("Invalid token!");
            return;
        }

        context.Items["DecodedToken"] = decodedToken;

        await _next(context);
    }

    public static string? GetToken()
    {
        return _token;
    }

    private static string? GetTokenFromHeader(HttpRequest request)
    {
        var authorizationHeader = request.Headers.Authorization.ToString();

        if (authorizationHeader?.StartsWith("Bearer ") == true)
        {
            return authorizationHeader.Substring("Bearer ".Length).Trim();
        }

        return null;
    }

    private static JwtSecurityToken? DecodeJwtToken()
    {
        var handler = new JwtSecurityTokenHandler();
        return handler.ReadToken(_token) as JwtSecurityToken;
    }
}

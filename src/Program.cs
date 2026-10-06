using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.config;
using backend.repo;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddScoped<Connection>();
builder.Services.AddSingleton<DatabaseInitializer>();
builder.Services.AddScoped<AlunoRepository>();
builder.Services.AddScoped<CursoRepository>();
builder.Services.AddScoped<AulaRepository>();
builder.Services.AddScoped<PresencaRepository>();
builder.Services
    .AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "NavCode.Admin";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
            ? CookieSecurePolicy.SameAsRequest
            : CookieSecurePolicy.Always;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
    });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<DatabaseInitializer>().Initialize();
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/admin/session", async (AdminLoginRequest request, HttpContext context, IConfiguration configuration) =>
{
    var configuredToken = configuration["Admin:Token"];
    if (string.IsNullOrWhiteSpace(configuredToken) || configuredToken.Length < 32)
        return Results.Problem("O acesso administrativo não está configurado.", statusCode: StatusCodes.Status503ServiceUnavailable);

    if (string.IsNullOrWhiteSpace(request.Token) || !TokensMatch(request.Token, configuredToken))
        return Results.Unauthorized();

    var identity = new ClaimsIdentity(
        [new Claim(ClaimTypes.Role, "admin")],
        CookieAuthenticationDefaults.AuthenticationScheme);

    await context.SignInAsync(
        CookieAuthenticationDefaults.AuthenticationScheme,
        new ClaimsPrincipal(identity),
        new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddHours(8)
        });

    return Results.NoContent();
}).AllowAnonymous();

app.MapPost("/admin/logout", async (HttpContext context) =>
{
    await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.NoContent();
}).AllowAnonymous();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();

static bool TokensMatch(string providedToken, string configuredToken)
{
    var providedBytes = Encoding.UTF8.GetBytes(providedToken);
    var configuredBytes = Encoding.UTF8.GetBytes(configuredToken);
    return providedBytes.Length == configuredBytes.Length
        && CryptographicOperations.FixedTimeEquals(providedBytes, configuredBytes);
}

public sealed record AdminLoginRequest(string? Token);

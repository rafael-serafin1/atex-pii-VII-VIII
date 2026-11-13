using backend.config;
using backend.repo;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddScoped<Connection>();
builder.Services.AddSingleton<DatabaseInitializer>();
builder.Services.AddScoped<AlunoRepository>();
builder.Services.AddScoped<CursoRepository>();
builder.Services.AddScoped<AulaRepository>();
builder.Services.AddScoped<PresencaRepository>();
var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    scope.ServiceProvider.GetRequiredService<DatabaseInitializer>().Initialize();
}

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.Run();

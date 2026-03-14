using BlazorApp.Components;
using Microsoft.EntityFrameworkCore;
using BlazorApp.Data;
using BlazorApp.Services; // Підключаємо папку з нашими сервісами

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// ========================================================
// 1. НАЛАШТУВАННЯ БАЗИ ДАНИХ (SQLite)
// ========================================================
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));

// ========================================================
// 2. РЕЄСТРАЦІЯ СЕРВІСІВ З UML-ДІАГРАМИ (БІЗНЕС-ЛОГІКА)
// ========================================================
builder.Services.AddScoped<ITransportRepository, TransportRepository>();
builder.Services.AddScoped<RentalService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
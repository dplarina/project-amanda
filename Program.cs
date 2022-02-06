using Azure.Data.Tables;
using Microsoft.EntityFrameworkCore;
using ProjectAmanda.Hubs;
using ProjectAmanda.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddApplicationInsightsTelemetry();

builder.Services.AddControllersWithViews();
builder.Services.AddSignalR();

var connectionString = builder.Configuration.GetConnectionString("StorageTables");
builder.Services.AddSingleton<TableClient>(new TableClient(connectionString, "ProjectAmanda"));
builder.Services.AddSingleton<TablesService>((services) => new TablesService(services.GetService<TableClient>() ?? throw new ArgumentNullException(nameof(TableClient))));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
  // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
  app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.UseEndpoints(endpoints =>
{
  endpoints.MapHub<ChangesHub>("/hub");
});

app.MapFallbackToFile("index.html");

app.Run();

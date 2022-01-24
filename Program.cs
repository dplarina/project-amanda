using Microsoft.EntityFrameworkCore;
using ProjectAmanda.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddApplicationInsightsTelemetry();

builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<DataContext>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
  using var dbContext = scope.ServiceProvider.GetService<DataContext>();
  if (dbContext == null)
  {
    throw new Exception("Failed to create database context");
  }

  dbContext.Database.Migrate();
}

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

app.MapFallbackToFile("index.html"); ;

app.Run();

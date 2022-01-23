using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ProjectAmanda.Models;

public class DataContext : DbContext
{
  public DbSet<Store> Stores { get; set; }
  public DbSet<StoreItem> StoreItems { get; set; }

  public string DbPath { get; }

  public DataContext()
  {
    const Environment.SpecialFolder folder = Environment.SpecialFolder.LocalApplicationData;
    var path = Environment.GetFolderPath(folder);
    DbPath = Path.Join(path, "data.db");
  }

  // The following configures EF to create a Sqlite database file in the
  // special "local" folder for your platform.
  protected override void OnConfiguring(DbContextOptionsBuilder options)
      => options.UseSqlite($"Data Source={DbPath}");
}

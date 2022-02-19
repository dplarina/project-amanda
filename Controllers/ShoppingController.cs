using Azure;
using Azure.Data.Tables;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectAmanda.Models;
using ProjectAmanda.Models.DTO;
using ProjectAmanda.Services;

namespace ProjectAmanda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShoppingController : ControllerBase
{
  private readonly TablesService _tablesService;
  public ShoppingController(TablesService tablesService)
  {
    _tablesService = tablesService;
  }

  [Route("list")]
  [HttpGet]
  public IEnumerable<Store> GetGroceryList()
  {
    var stores = _tablesService.GetStores()
      .Select(s => s.ToDTO())
      .ToList();
    // for each store, filter items to only selected items
    foreach (var store in stores)
    {
      store.items = store.items.Where(i => i.selected).ToList();
    }

    return stores;
  }
}

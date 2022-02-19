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
    return _tablesService.GetStores().Select(s => s.ToDTO());
  }
}

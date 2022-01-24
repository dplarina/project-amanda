using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectAmanda.Models;

namespace ProjectAmanda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShoppingController : ControllerBase
{
  private readonly DataContext _dbContext;
  public ShoppingController(DataContext dbContext)
  {
    _dbContext = dbContext;
  }

  [Route("list")]
  [HttpGet]
  public async Task<IEnumerable<Store>> GetGroceryList()
  {
    return await _dbContext.Stores
    .Where(s => s.items.Count > 0)
    .Select(s => new Store
    {
      storeId = s.storeId,
      name = s.name,
      items = s.items.Where(i => i.selected).ToList()
    })
    .ToListAsync();
  }

}

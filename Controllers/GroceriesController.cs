using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectAmanda.Models;

namespace ProjectAmanda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroceriesController : ControllerBase
{
  private readonly DataContext _dbContext;
  public GroceriesController(DataContext dbContext)
  {
    _dbContext = dbContext;
  }

  [Route("list")]
  [HttpGet]
  public async Task<IEnumerable<Store>> GetGroceryList()
  {
    return await _dbContext.Stores
    .Include(s => s.items)
    .Where(s => s.items.Count > 0)
    .ToListAsync();
  }

}

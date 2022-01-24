using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProjectAmanda.Models;

namespace ProjectAmanda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoresController : ControllerBase
{
  private readonly DataContext _dbContext;
  public StoresController(DataContext dbContext)
  {
    _dbContext = dbContext;
  }

  [Route("")]
  [HttpGet]
  public async Task<IEnumerable<Store>> GetStoresAsync()
  {
    return await _dbContext.Stores.Include(s => s.items).ToListAsync();
  }

  [Route("")]
  [HttpPost]
  public async Task<Store> CreateStoreAsync([FromBody] Store store)
  {
    _dbContext.Stores.Add(store);
    await _dbContext.SaveChangesAsync();
    return store;
  }

  [Route("{id}")]
  [HttpGet]
  public async Task<ActionResult<Store>> GetStoreAsync(int id)
  {
    var storeInDb = await _dbContext.Stores
    .Include(s => s.items)
    .FirstOrDefaultAsync(store => store.storeId == id);
    return storeInDb ?? (ActionResult<Store>)NotFound();
  }

  [Route("{id}")]
  [HttpPut]
  public async Task<ActionResult> UpdateStoreAsync(int id, Store store)
  {
    var storeInDb = await _dbContext.Stores.FirstOrDefaultAsync(x => x.storeId == id);
    if (storeInDb == null)
    {
      return NotFound();
    }

    storeInDb.name = store.name;
    await _dbContext.SaveChangesAsync();

    return Ok();
  }

  [Route("{id}")]
  [HttpDelete]
  public async Task DeleteStoreAsync(int id)
  {
    var storeInDb = await _dbContext.Stores.FirstOrDefaultAsync(x => x.storeId == id);
    if (storeInDb == null)
    {
      return;
    }

    _dbContext.Stores.Remove(storeInDb);
    await _dbContext.SaveChangesAsync();
  }

  [Route("{id}/items")]
  [HttpGet]
  public async Task<IEnumerable<Store>> GetStoreItemsAsync()
  {
    return await _dbContext.Stores.ToListAsync();
  }

  [Route("{storeId}/items/{itemId}")]
  [HttpGet]
  public async Task<ActionResult<StoreItem>> GetStoreItemAsync(int storeId, int itemId)
  {
    var itemInDb = await _dbContext.StoreItems.FirstOrDefaultAsync(item => item.storeId == storeId && item.storeItemId == itemId);
    if (itemInDb == null)
    {
      return NotFound();
    }

    return Ok(itemInDb);
  }

  [Route("{storeId}/items")]
  [HttpPost]
  public async Task<ActionResult<StoreItem>> CreateStoreItemAsync(int storeId, [FromBody] StoreItem item)
  {
    var storeInDb = await _dbContext.Stores
    .Include(s => s.items)
    .FirstOrDefaultAsync(store => store.storeId == storeId);
    if (storeInDb == null)
    {
      return NotFound();
    }

    storeInDb.items.Add(item);
    await _dbContext.SaveChangesAsync();

    return Ok(item);
  }

  [Route("{storeId}/items/{itemId}")]
  [HttpPut]
  public async Task<ActionResult> UpdateStoreItemAsync(int storeId, int itemId, StoreItem item)
  {
    var itemInDb = await _dbContext.StoreItems.FirstOrDefaultAsync(x => x.storeId == storeId && x.storeItemId == itemId);
    if (itemInDb == null)
    {
      return NotFound();
    }

    itemInDb.name = item.name;
    itemInDb.selected = item.selected;
    itemInDb.completed = item.completed;
    await _dbContext.SaveChangesAsync();

    return Ok();
  }

  [Route("{storeId}/items/{itemId}")]
  [HttpDelete]
  public async Task DeleteStoreItemAsync(int storeId, int itemId)
  {
    var itemInDb = await _dbContext.StoreItems.FirstOrDefaultAsync(x => x.storeId == storeId && x.storeItemId == itemId);
    if (itemInDb == null)
    {
      return;
    }

    _dbContext.StoreItems.Remove(itemInDb);
    await _dbContext.SaveChangesAsync();
  }
}

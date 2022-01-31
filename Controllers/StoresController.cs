using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ProjectAmanda.Hubs;
using ProjectAmanda.Models;

namespace ProjectAmanda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoresController : ControllerBase
{
  private readonly DataContext _dbContext;
  private readonly IHubContext<ChangesHub> _hubContext;
  public StoresController(DataContext dbContext, IHubContext<ChangesHub> hubContext)
  {
    _dbContext = dbContext;
    _hubContext = hubContext;
  }

  [Route("")]
  [HttpGet]
  public async Task<IEnumerable<Store>> GetStoresAsync()
  {
    return await _dbContext.Stores.Include(s => s.items)
    .Select(s => new Store
    {
      storeId = s.storeId,
      name = s.name,
      items = s.items.OrderBy(i => i.name).ToList()
    })
    .ToListAsync();
  }

  [Route("")]
  [HttpPost]
  public async Task<Store> CreateStoreAsync([FromBody] Store store)
  {
    _dbContext.Stores.Add(store);
    await _dbContext.SaveChangesAsync();

    await _hubContext.Clients.All.SendAsync("refresh");

    return store;
  }

  [Route("{id}")]
  [HttpGet]
  public async Task<ActionResult<Store>> GetStoreAsync(int id)
  {
    var storeInDb = await _dbContext.Stores
    .Include(s => s.items)
    .Select(s => new Store
    {
      storeId = s.storeId,
      name = s.name,
      items = s.items.OrderBy(i => i.name).ToList()
    })
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

    await _hubContext.Clients.All.SendAsync("refresh");

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

    await _hubContext.Clients.All.SendAsync("refresh");
  }

  [Route("{storeId}/items")]
  [HttpGet]
  public async Task<IEnumerable<StoreItem>> GetStoreItemsAsync(int storeId)
  {
    return await _dbContext.StoreItems
    .Where(s => s.storeId == storeId)
    .OrderBy(s => s.name)
    .ToListAsync();
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

    await _hubContext.Clients.All.SendAsync("refresh");

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

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }

  [Route("{storeId}/items/{itemId}/selected")]
  [HttpPut]
  public async Task<ActionResult> SetStoreItemSelectedAsync(int storeId, int itemId, [FromBody] bool selected)
  {
    var itemInDb = await _dbContext.StoreItems.FirstOrDefaultAsync(x => x.storeId == storeId && x.storeItemId == itemId);
    if (itemInDb == null)
    {
      return NotFound();
    }

    itemInDb.selected = selected;
    await _dbContext.SaveChangesAsync();

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }

  [Route("{storeId}/items/{itemId}/completed")]
  [HttpPut]
  public async Task<ActionResult> SetStoreItemCompeltedAsync(int storeId, int itemId, [FromBody] bool completed)
  {
    var itemInDb = await _dbContext.StoreItems.FirstOrDefaultAsync(x => x.storeId == storeId && x.storeItemId == itemId);
    if (itemInDb == null)
    {
      return NotFound();
    }

    itemInDb.completed = completed;
    await _dbContext.SaveChangesAsync();

    await _hubContext.Clients.All.SendAsync("refresh");

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

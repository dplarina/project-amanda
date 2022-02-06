using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ProjectAmanda.Hubs;
using ProjectAmanda.Models;
using ProjectAmanda.Services;

namespace ProjectAmanda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoresController : ControllerBase
{
  private readonly TablesService _tablesService;
  private readonly IHubContext<ChangesHub> _hubContext;
  public StoresController(TablesService tablesService, IHubContext<ChangesHub> hubContext)
  {
    _tablesService = tablesService;
    _hubContext = hubContext;
  }


  [Route("")]
  [HttpGet]
  public IEnumerable<Store> GetStores()
  {
    return _tablesService.GetStores();
  }

  [Route("{name}")]
  [HttpGet]
  public async Task<ActionResult<Store>> GetStoreAsync(string name)
  {
    var store = await _tablesService.GetStoreAsync(name);

    if (store == null)
    {
      return NotFound();
    }

    return store;
  }

  [Route("{name}")]
  [HttpPut]
  public async Task<ActionResult> UpdateStoreAsync(string name, Store store, CancellationToken cancellationToken = default)
  {
    store.PartitionKey = "Amanda";
    store.RowKey = name;

    await _tablesService.UpsertStoreAsync(store);

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }

  [Route("{name}")]
  [HttpDelete]
  public async Task DeleteStoreAsync(string name)
  {
    await _tablesService.DeleteStoreAsync("Amanda", name);

    await _hubContext.Clients.All.SendAsync("refresh");
  }

  [Route("{name}/items")]
  [HttpGet]
  public async Task<ActionResult<IEnumerable<StoreItem>>> GetStoreItemsAsync(string name)
  {
    var items = await _tablesService.GetStoreItemsAsync(name);
    if (items == null)
    {
      return NotFound();
    }

    return items;
  }

  [Route("{name}/items/{itemName}")]
  [HttpGet]
  public async Task<ActionResult<StoreItem>> GetStoreItemAsync(string name, string itemName)
  {
    var item = await _tablesService.GetStoreItemAsync(name, itemName);
    if (item == null)
    {
      return NotFound();
    }

    return item;
  }

  [Route("{storeName}/items/{itemName}")]
  [HttpPut]
  public async Task<ActionResult> UpsertStoreItemAsync(string storeName, string itemName, StoreItem item)
  {
    var store = await _tablesService.GetStoreAsync(storeName);
    if (store == null)
    {
      return NotFound();
    }

    var existingItem = store.items.Where(i => i.name == itemName).FirstOrDefault();
    if (existingItem == null)
    {
      store.items.Add(item);
    }
    else
    {
      existingItem.selected = item.selected;
      existingItem.completed = item.completed;
    }

    await _tablesService.UpsertStoreAsync(store);

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }

  [Route("{storeKey}/items/{itemKey}/selected")]
  [HttpPut]
  public async Task<ActionResult> SetStoreItemSelectedAsync(string storeKey, string itemKey, [FromBody] bool selected)
  {
    var store = await _tablesService.GetStoreAsync(storeKey);
    if (store == null)
    {
      return NotFound();
    }

    var existingItem = store.items.Where(i => i.name == itemKey).FirstOrDefault();
    if (existingItem == null)
    {
      return NotFound();
    }

    existingItem.selected = existingItem.selected;

    await _tablesService.UpsertStoreAsync(store);

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }

  [Route("{storeKey}/items/{itemKey}/completed")]
  [HttpPut]
  public async Task<ActionResult> SetStoreItemCompletedAsync(string storeKey, string itemKey, [FromBody] bool completed)
  {
    var store = await _tablesService.GetStoreAsync(storeKey);
    if (store == null)
    {
      return NotFound();
    }

    var existingItem = store.items.Where(i => i.name == itemKey).FirstOrDefault();
    if (existingItem == null)
    {
      return NotFound();
    }

    existingItem.completed = existingItem.completed;

    await _tablesService.UpsertStoreAsync(store);

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }

  [Route("{storeKey}/items/{itemKey}")]
  [HttpDelete]
  public async Task<ActionResult> DeleteStoreItemAsync(string storeKey, string itemKey)
  {
    var store = await _tablesService.GetStoreAsync(storeKey);
    if (store == null)
    {
      return NotFound();
    }

    foreach (var item in store.items)
    {
      if (item.name == itemKey)
      {
        store.items.Remove(item);
      }
    }

    await _tablesService.UpsertStoreAsync(store);

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }
}

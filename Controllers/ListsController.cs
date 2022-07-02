using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ProjectAmanda.Hubs;
using ProjectAmanda.Models;
using ProjectAmanda.Models.DTO;
using ProjectAmanda.Services;

namespace ProjectAmanda.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ListsController : ControllerBase
{
  private readonly TablesService _tablesService;
  private readonly IHubContext<ChangesHub> _hubContext;
  public ListsController(TablesService tablesService, IHubContext<ChangesHub> hubContext)
  {
    _tablesService = tablesService;
    _hubContext = hubContext;
  }

  [Route("")]
  [HttpGet]
  public IEnumerable<List> GetLists()
  {
    return _tablesService.GetLists().Select(s => s.ToDTO());
  }

  [Route("{name}")]
  [HttpGet]
  public async Task<ActionResult<List>> GetListAsync(string name)
  {
    var store = await _tablesService.GetListAsync(name);

    if (store == null)
    {
      return NotFound();
    }

    return store.ToDTO();
  }

  [Route("{name}")]
  [HttpPut]
  public async Task<ActionResult> UpdateListAsync(List list, CancellationToken cancellationToken = default)
  {
    await _tablesService.UpsertListAsync(list.ToEntity());

    await _hubContext.Clients.All.SendAsync("refresh", cancellationToken);

    return Ok();
  }

  [Route("{name}")]
  [HttpDelete]
  public async Task DeleteListAsync(string name)
  {
    await _tablesService.DeleteListAsync("Amanda", name);

    await _hubContext.Clients.All.SendAsync("refresh");
  }

  [Route("{name}/items")]
  [HttpGet]
  public async Task<ActionResult<IEnumerable<ListItem>>> GetListItemsAsync(string name)
  {
    var items = await _tablesService.GetListItemsAsync(name);
    if (items == null)
    {
      return NotFound();
    }

    return items;
  }

  [Route("{name}/items/{itemName}")]
  [HttpGet]
  public async Task<ActionResult<ListItem>> GetListItemAsync(string name, string itemName)
  {
    var item = await _tablesService.GetListItemAsync(name, itemName);
    if (item == null)
    {
      return NotFound();
    }

    return item;
  }

  [Route("{storeKey}/items/{itemName}")]
  [HttpPut]
  public async Task<ActionResult> UpsertListItemAsync(string storeKey, string itemName, ListItem item)
  {
    var storeEntity = await _tablesService.GetListAsync(storeKey);

    if (storeEntity == null)
    {
      return NotFound();
    }

    var store = storeEntity.ToDTO();

    var existingItem = store.items.Find(i => i.name == itemName);
    if (existingItem == null)
    {
      store.items.Add(item);
    }
    else
    {
      existingItem.selected = item.selected;
      existingItem.completed = item.completed;
    }

    await _tablesService.UpsertListAsync(store.ToEntity());

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }

  [Route("{storeKey}/items/{itemKey}/selected")]
  [HttpPut]
  public async Task<ActionResult> SetListItemSelectedAsync(string storeKey, string itemKey, [FromBody] bool selected)
  {
    var storeEntity = await _tablesService.GetListAsync(storeKey);

    if (storeEntity == null)
    {
      return NotFound();
    }

    var store = storeEntity.ToDTO();

    var existingItem = store.items.Find(i => i.name == itemKey);
    if (existingItem == null)
    {
      return NotFound();
    }

    existingItem.selected = selected;

    await _tablesService.UpsertListAsync(store.ToEntity());

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }

  [Route("{storeKey}/items/{itemKey}/completed")]
  [HttpPut]
  public async Task<ActionResult> SetListItemCompletedAsync(string storeKey, string itemKey, [FromBody] bool completed)
  {
    var storeEntity = await _tablesService.GetListAsync(storeKey);

    if (storeEntity == null)
    {
      return NotFound();
    }

    var store = storeEntity.ToDTO();

    var existingItem = store.items.Find(i => i.name == itemKey);
    if (existingItem == null)
    {
      return NotFound();
    }

    existingItem.completed = completed;

    await _tablesService.UpsertListAsync(store.ToEntity());

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }

  [Route("{storeKey}/items/{itemKey}/category")]
  [HttpPut]
  public async Task<ActionResult> SetListItemCategoryAsync(string storeKey, string itemKey, [FromBody] int categoryId)
  {
    var storeEntity = await _tablesService.GetListAsync(storeKey);

    if (storeEntity == null)
    {
      return NotFound();
    }

    var store = storeEntity.ToDTO();

    var existingItem = store.items.Find(i => i.name == itemKey);
    if (existingItem == null)
    {
      return NotFound();
    }

    existingItem.categoryId = categoryId;

    await _tablesService.UpsertListAsync(store.ToEntity());

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }

  [Route("{storeKey}/items/{itemKey}")]
  [HttpDelete]
  public async Task<ActionResult> DeleteListItemAsync(string storeKey, string itemKey)
  {
    var storeEntity = await _tablesService.GetListAsync(storeKey);

    if (storeEntity == null)
    {
      return NotFound();
    }

    var store = storeEntity.ToDTO();

    store.items.RemoveAll(i => i.name == itemKey);

    await _tablesService.UpsertListAsync(store.ToEntity());

    await _hubContext.Clients.All.SendAsync("refresh");

    return Ok();
  }
}

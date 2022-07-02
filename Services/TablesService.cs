using Azure;
using Azure.Data.Tables;
using ProjectAmanda.Models;
using ProjectAmanda.Models.DTO;

namespace ProjectAmanda.Services;

public class TablesService
{
  private TableClient _tableClient;

  public TablesService(TableClient tableClient)
  {
    _tableClient = tableClient;
  }

  public IEnumerable<ListEntity> GetLists()
  {
    foreach (var entity in _tableClient.Query<TableEntity>())
    {
      yield return ListEntity.CreateFromEntity(entity);
    }
  }

  public async Task<ListEntity?> GetListAsync(string name)
  {
    var response = await _tableClient.GetEntityAsync<TableEntity>("Amanda", name);

    return response?.Value == null ? null : ListEntity.CreateFromEntity(response.Value);
  }

  public async Task UpsertListAsync(ListEntity store)
  {
    await _tableClient.UpsertEntityAsync(store);
  }

  public async Task DeleteListAsync(string partitionKey, string rowKey)
  {
    await _tableClient.DeleteEntityAsync(partitionKey, rowKey);
  }

  public async Task<List<ListItem>?> GetListItemsAsync(string name)
  {
    var response = await _tableClient.GetEntityAsync<TableEntity>("Amanda", name);

    return response?.Value == null ? null : ListEntity.CreateFromEntity(response.Value).ToDTO().items.ToList();
  }

  public async Task<ListItem?> GetListItemAsync(string name, string itemName)
  {
    var response = await _tableClient.GetEntityAsync<TableEntity>("Amanda", name);

    return response?.Value == null ? null : ListEntity.CreateFromEntity(response.Value).ToDTO().items.FirstOrDefault(i => i.name == itemName);
  }
}

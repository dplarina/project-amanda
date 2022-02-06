using Azure;
using Azure.Data.Tables;
using ProjectAmanda.Models;

namespace ProjectAmanda.Services;

public class TablesService
{
  private TableClient _tableClient;

  public TablesService(TableClient tableClient)
  {
    _tableClient = tableClient;
  }

  public IEnumerable<Store> GetStores()
  {
    foreach (var entity in _tableClient.Query<TableEntity>())
    {
      yield return Store.CreateFromEntity(entity);
    }
  }

  public async Task<Store?> GetStoreAsync(string name)
  {
    var response = await _tableClient.GetEntityAsync<TableEntity>("Amanda", name);

    return response?.Value == null ? null : Store.CreateFromEntity(response.Value);
  }

  public async Task UpsertStoreAsync(Store store)
  {
    await _tableClient.UpsertEntityAsync(store);
  }

  public async Task DeleteStoreAsync(string partitionKey, string rowKey)
  {
    await _tableClient.DeleteEntityAsync(partitionKey, rowKey);
  }

  public async Task<List<StoreItem>?> GetStoreItemsAsync(string name)
  {
    var response = await _tableClient.GetEntityAsync<TableEntity>("Amanda", name);

    return response?.Value == null ? null : Store.CreateFromEntity(response.Value).items.ToList();
  }

  public async Task<StoreItem?> GetStoreItemAsync(string name, string itemName)
  {
    var response = await _tableClient.GetEntityAsync<TableEntity>("Amanda", name);

    return response?.Value == null ? null : Store.CreateFromEntity(response.Value).items.FirstOrDefault(i => i.name == itemName);
  }
}

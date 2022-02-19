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

  public IEnumerable<StoreEntity> GetStores()
  {
    foreach (var entity in _tableClient.Query<TableEntity>())
    {
      yield return StoreEntity.CreateFromEntity(entity);
    }
  }

  public async Task<StoreEntity?> GetStoreAsync(string name)
  {
    var response = await _tableClient.GetEntityAsync<TableEntity>("Amanda", name);

    return response?.Value == null ? null : StoreEntity.CreateFromEntity(response.Value);
  }

  public async Task UpsertStoreAsync(StoreEntity store)
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

    return response?.Value == null ? null : StoreEntity.CreateFromEntity(response.Value).ToDTO().items.ToList();
  }

  public async Task<StoreItem?> GetStoreItemAsync(string name, string itemName)
  {
    var response = await _tableClient.GetEntityAsync<TableEntity>("Amanda", name);

    return response?.Value == null ? null : StoreEntity.CreateFromEntity(response.Value).ToDTO().items.FirstOrDefault(i => i.name == itemName);
  }
}

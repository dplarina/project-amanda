using System.Text.Json;
using Azure.Data.Tables;

namespace ProjectAmanda.Models.DTO;

public class Store
{
  public string name { get; set; }
  public List<StoreItem> items { get; set; }

  public StoreEntity ToEntity()
  {
    return new StoreEntity
    {
      PartitionKey = "Amanda",
      RowKey = name,
      Name = name,
      Items = JsonSerializer.Serialize(items ?? new List<StoreItem>())
    };
  }
}

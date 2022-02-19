using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;
using Azure;
using Azure.Data.Tables;
using ProjectAmanda.Models.DTO;

namespace ProjectAmanda.Models;

public class StoreEntity : ITableEntity
{
  public string? PartitionKey { get; set; }
  public string? RowKey { get; set; }
  public DateTimeOffset? Timestamp { get; set; }
  public ETag ETag { get; set; }

  public string Name { get; set; }
  public string Items { get; set; }

  public Store ToDTO()
  {
    return new Store()
    {
      name = Name,
      items = JsonSerializer.Deserialize<List<StoreItem>>(Items)
    };
  }

  public static StoreEntity CreateFromEntity(TableEntity entity)
  {
    return new StoreEntity
    {
      PartitionKey = entity.PartitionKey,
      RowKey = entity.RowKey,
      ETag = entity.ETag,
      Name = (string)entity["Name"],
      Items = (string)entity["Items"] ?? "[]"
    };
  }
}

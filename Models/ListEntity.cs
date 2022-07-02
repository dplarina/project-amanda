using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;
using Azure;
using Azure.Data.Tables;
using ProjectAmanda.Models.DTO;

namespace ProjectAmanda.Models;

public class ListEntity : ITableEntity
{
  public string? PartitionKey { get; set; }
  public string? RowKey { get; set; }
  public DateTimeOffset? Timestamp { get; set; }
  public ETag ETag { get; set; }

  public string Name { get; set; }
  public string Items { get; set; }

  public List ToDTO()
  {
    var items = JsonSerializer.Deserialize<List<ListItem>>(Items);
    items.ForEach(i => { i.categoryId = i.categoryId == 0 ? 1 : i.categoryId; });
    return new List()
    {
      name = Name,
      items = items
    };
  }

  public static ListEntity CreateFromEntity(TableEntity entity)
  {
    return new ListEntity
    {
      PartitionKey = entity.PartitionKey,
      RowKey = entity.RowKey,
      ETag = entity.ETag,
      Name = (string)entity["Name"],
      Items = (string)entity["Items"] ?? "[]"
    };
  }
}

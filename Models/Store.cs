using System.Runtime.Serialization;
using System.Text.Json;
using System.Text.Json.Serialization;
using Azure.Data.Tables;

namespace ProjectAmanda.Models;

public class Store : StorageTableEntityBase
{
  public Store()
  {
    this.name = "";
  }
  public string name { get; set; }

  [JsonIgnore]
  public string _items
  {
    get { return JsonSerializer.Serialize(items ?? new List<StoreItem>()); }
    set { this.items = JsonSerializer.Deserialize<List<StoreItem>>(value ?? "[]"); }
  }

  [IgnoreDataMember]
  public ICollection<StoreItem> items;

  public static Store CreateFromEntity(TableEntity entity)
  {
    return new Store
    {
      PartitionKey = entity.PartitionKey,
      RowKey = entity.RowKey,
      ETag = entity.ETag,
      name = (string)entity["name"],
      items = JsonSerializer.Deserialize<List<StoreItem>>(entity["items"]?.ToString() ?? "[]").ToList()
    };
  }
}

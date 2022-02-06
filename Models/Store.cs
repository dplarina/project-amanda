using System.Runtime.Serialization;
using Azure.Data.Tables;
using Newtonsoft.Json;

namespace ProjectAmanda.Models;

public class Store : StorageTableEntityBase
{
  public Store()
  {
    this.name = "";
    this._items = "[]";
  }
  public string name { get; set; }

  [JsonIgnore]
  public string _items;

  [IgnoreDataMember]
  public List<StoreItem> items
  {
    get { return JsonConvert.DeserializeObject<List<StoreItem>>(_items ?? "[]"); }
    set { _items = JsonConvert.SerializeObject(value ?? new List<StoreItem>()); }
  }


  public static Store CreateFromEntity(TableEntity entity)
  {
    return new Store
    {
      PartitionKey = entity.PartitionKey,
      RowKey = entity.RowKey,
      ETag = entity.ETag,
      name = (string)entity["name"],
      items = JsonConvert.DeserializeObject<List<StoreItem>>(entity["items"]?.ToString() ?? "[]").ToList()
    };
  }
}

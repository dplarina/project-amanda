using System.Text.Json;
using Azure.Data.Tables;

namespace ProjectAmanda.Models.DTO;

public class List
{
  public string name { get; set; }
  public List<ListItem> items { get; set; }

  public ListEntity ToEntity()
  {
    return new ListEntity
    {
      PartitionKey = "Amanda",
      RowKey = name,
      Name = name,
      Items = JsonSerializer.Serialize(items ?? new List<ListItem>())
    };
  }
}

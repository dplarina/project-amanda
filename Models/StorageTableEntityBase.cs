using Azure;
using Azure.Data.Tables;

public class StorageTableEntityBase : ITableEntity
{
  public string? PartitionKey { get; set; }
  public string? RowKey { get; set; }
  public DateTimeOffset? Timestamp { get; set; }
  public ETag ETag { get; set; }

  public StorageTableEntityBase() { }

  public StorageTableEntityBase(string partitionKey, string rowKey)
  {
    PartitionKey = partitionKey;
    RowKey = rowKey;
  }
}

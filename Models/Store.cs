namespace ProjectAmanda.Models;

public class Store
{
  public int storeId { get; set; }
  public string name { get; set; }

  public ICollection<StoreItem> items { get; set; }
}

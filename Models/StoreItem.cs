namespace ProjectAmanda.Models
{
  public class StoreItem
  {
    public int storeItemId { get; set; }
    public int storeId { get; set; }
    public string name { get; set; }
    public bool selected { get; set; }
    public bool completed { get; set; }
  }
}
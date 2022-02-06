namespace ProjectAmanda.Models
{
  public class StoreItem
  {
    public StoreItem(string name)
    {
      this.name = name;
    }
    public string name { get; set; }
    public bool selected { get; set; }
    public bool completed { get; set; }
  }
}

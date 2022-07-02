namespace ProjectAmanda.Models.DTO;

public class ListItem
{
  public ListItem(string name)
  {
    this.name = name;
  }
  public string name { get; set; }
  public int categoryId { get; set; }
  public bool selected { get; set; }
  public bool completed { get; set; }
}


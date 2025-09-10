namespace ExpenseTracker.API.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string UserId { get; set; } = null!;
    public User User { get; set; } = null!;
}
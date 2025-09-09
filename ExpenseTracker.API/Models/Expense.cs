namespace ExpenseTracker.API.Models;

public class Expense
{
    public int Id { get; set; }
    public string Description { get; set; } = null!;
    public double Amount { get; set; }
    public DateTime Date { get; set; } = DateTime.Now;
    
    public string UserId { get; set; }
    public int CategoryId { get; set; }
    
    public User User { get; set; }
    public Category Category { get; set; }
}
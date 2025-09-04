namespace ExpenseTracker.API.Models;

public class Expense
{
    public int Id { get; set; }
    public string Description { get; set; } = null!;
    public double Amount { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; }
    public DateTime Date { get; set; } = DateTime.Now;
}
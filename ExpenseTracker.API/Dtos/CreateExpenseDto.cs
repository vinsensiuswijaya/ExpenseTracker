namespace ExpenseTracker.API.DTOs;

public class CreateExpenseDto
{
    public string Description { get; set; }
    public double Amount { get; set; }
    public int CategoryId { get; set; }
    public DateTime Date { get; set; }
}
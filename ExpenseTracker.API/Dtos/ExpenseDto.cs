namespace ExpenseTracker.API.DTOs;

public class ExpenseDto
{
    public int Id { get; set; }
    public string Description { get; set; } = null!;
    public decimal Amount { get; set; }
    public int CategoryId { get; set; }
    public string? CategoryName { get; set; }
    public DateTime Date { get; set; }
    public string UserId { get; set; }
}
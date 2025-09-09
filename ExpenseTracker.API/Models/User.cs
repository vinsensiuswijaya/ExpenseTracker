using Microsoft.AspNetCore.Identity;

namespace ExpenseTracker.API.Models;

public class User : IdentityUser
{
    public ICollection<Category> Categories { get; set; } = new List<Category>();
    public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
}
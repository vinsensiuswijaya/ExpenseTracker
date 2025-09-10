﻿namespace ExpenseTracker.API.DTOs;

public class CreateExpenseDto
{
    public string Description { get; set; }
    public decimal Amount { get; set; }
    public int CategoryId { get; set; }
    public DateTime Date { get; set; }
}
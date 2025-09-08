using ExpenseTracker.API.DTOs;
using FluentValidation;

namespace ExpenseTracker.API.Validators;

public class ExpenseValidator : AbstractValidator<ExpenseDto>
{
    public ExpenseValidator()
    {
        RuleFor(e => e.Description)
            .NotEmpty().WithMessage("Description is required!")
            .Length(1, 100).WithMessage("Description must be between 1 and 100 characters!")
            .Matches(@"^[a-zA-Z0-9\s]+$").WithMessage("Description can only contain letters, number, and spaces!");
        
        RuleFor(e => e.Amount)
            .NotEmpty().WithMessage("Amount is required!")
            .GreaterThan(0).WithMessage("Amount has to be greater than 0!");
        
        RuleFor(e => e.CategoryId)
            .NotEmpty().WithMessage("Category is required!")
            .GreaterThan(0).WithMessage("Category must be selected!");
    }
}
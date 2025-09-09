using ExpenseTracker.API.DTOs;
using FluentValidation;

namespace ExpenseTracker.API.Validators;

public class CreateCategoryValidator : AbstractValidator<CreateCategoryDto>
{
    public CreateCategoryValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("Name is required!")
            .Length(1, 50).WithMessage("Name must be between 1 and 50 characters!")
            .Matches(@"^[a-zA-Z0-9\s]+$").WithMessage("Name can only contain letters, numbers, and spaces!");
    }
}
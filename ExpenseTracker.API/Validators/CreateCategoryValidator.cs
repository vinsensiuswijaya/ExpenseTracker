using ExpenseTracker.API.DTOs;
using FluentValidation;

namespace ExpenseTracker.API.Validators;

public class CreateCategoryValidator : AbstractValidator<CreateCategoryDto>
{
    public CreateCategoryValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty().WithMessage("Category name is required!")
            .Length(1, 50).WithMessage("Category name must be between 1 and 50 characters!")
            // .Matches(@"^[a-zA-Z0-9\s]+$").WithMessage("Name can only contain letters, numbers, and spaces!");
            .Matches(@"^[\p{L}]\p{N}\s\s\-\.,'()]+$").WithMessage("Category name contains invalid characters.");
    }
}
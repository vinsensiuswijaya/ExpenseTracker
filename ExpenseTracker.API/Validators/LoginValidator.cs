using ExpenseTracker.API.DTOs;
using FluentValidation;

namespace ExpenseTracker.API.Validators;

public class LoginValidator : AbstractValidator<LoginDto>
{
    public LoginValidator()
    {
        RuleFor(l => l.Username)
            .NotEmpty().WithMessage("Username is required");

        RuleFor(l => l.Password)
            .NotEmpty().WithMessage("Password is required");
    }
}
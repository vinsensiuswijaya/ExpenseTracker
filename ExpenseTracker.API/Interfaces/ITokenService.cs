using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.Interfaces;

public interface ITokenService
{
    string CreateToken(User user);
}
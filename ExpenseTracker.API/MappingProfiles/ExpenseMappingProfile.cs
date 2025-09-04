using AutoMapper;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.Models;

namespace ExpenseTracker.API.MappingProfiles;

public class ExpenseMappingProfile : Profile
{
    public ExpenseMappingProfile()
    {
        CreateMap<Expense, ExpenseDTO>()
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name));
        CreateMap<ExpenseDTO, Expense>()
            .ForMember(dest => dest.Category, opt => opt.Ignore());
    }
}
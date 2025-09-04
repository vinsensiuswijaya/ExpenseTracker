using ExpenseTracker.API.Data;
using ExpenseTracker.API.DTOs;
using ExpenseTracker.API.MappingProfiles;
using ExpenseTracker.API.Models;
using ExpenseTracker.API.Services;
using ExpenseTracker.API.Validators;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure PostgreSQL as the database provider
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql((builder.Configuration.GetConnectionString("DefaultConnection"))));

// Register FluentValidation validators
builder.Services.AddScoped<IValidator<ExpenseDTO>, ExpenseValidator>();
builder.Services.AddScoped<IValidator<CategoryDTO>, CategoryValidator>();

// Register AutoMapper
builder.Services.AddAutoMapper(cfg => { }, typeof(Program).Assembly);

// Register Services
builder.Services.AddScoped<IExpensesService, ExpensesService>();
builder.Services.AddScoped<ICategoriesService, CategoriesService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
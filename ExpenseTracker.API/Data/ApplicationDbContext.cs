using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Data;

public class ApplicationDbContext : IdentityDbContext<User>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

    public DbSet<Expense> Expenses { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        List<IdentityRole> roles = new List<IdentityRole>
        {
            new IdentityRole
            {
                Id = "1",
                Name = "Admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole
            {
                Id = "2",
                Name = "User",
                NormalizedName = "USER"
            },
        };
        builder.Entity<IdentityRole>().HasData(roles);

        builder.Entity<Category>()
            .HasOne(c => c.User)
            .WithMany(u => u.Categories)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Category>()
            .HasIndex(c => c.UserId);

        builder.Entity<Category>()
            .HasIndex(c => new { c.UserId, c.Name })
            .IsUnique();

        builder.Entity<Expense>()
            .HasOne(e => e.User)
            .WithMany(u => u.Expenses)
            .HasForeignKey(e => e.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Expense>()
            .HasOne(e => e.Category)
            .WithMany()
            .HasForeignKey(e => e.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Expense>()
            .HasIndex(e => new { e.UserId, e.Date });

        builder.Entity<Expense>()
            .HasIndex(e => new { e.UserId, e.CategoryId });
    }
}
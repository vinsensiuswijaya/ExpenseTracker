using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseTracker.API.Migrations
{
    /// <inheritdoc />
    public partial class AddPerfIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Expenses_UserId",
                table: "Expenses");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_UserId_CategoryId",
                table: "Expenses",
                columns: new[] { "UserId", "CategoryId" });

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_UserId_Date",
                table: "Expenses",
                columns: new[] { "UserId", "Date" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Expenses_UserId_CategoryId",
                table: "Expenses");

            migrationBuilder.DropIndex(
                name: "IX_Expenses_UserId_Date",
                table: "Expenses");

            migrationBuilder.CreateIndex(
                name: "IX_Expenses_UserId",
                table: "Expenses",
                column: "UserId");
        }
    }
}

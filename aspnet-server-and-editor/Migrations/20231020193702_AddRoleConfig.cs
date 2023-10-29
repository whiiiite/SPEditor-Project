using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SPEditor.Migrations
{
    /// <inheritdoc />
    public partial class AddRoleConfig : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "54cd34e6-f67b-43ea-b990-c0271dbfd43a", null, "Donator", "DONATOR" },
                    { "8de38b35-19d8-4001-8f62-516a977b46e4", null, "Administrator", "ADMINISTRATOR" },
                    { "bc3de93e-628a-4200-ab12-b3fff906aaea", null, "Simple", "SIMPLE" },
                    { "c44358db-146e-46db-afc5-0b7744e39c15", null, "Owner", "OWNER" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "54cd34e6-f67b-43ea-b990-c0271dbfd43a");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "8de38b35-19d8-4001-8f62-516a977b46e4");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bc3de93e-628a-4200-ab12-b3fff906aaea");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c44358db-146e-46db-afc5-0b7744e39c15");
        }
    }
}

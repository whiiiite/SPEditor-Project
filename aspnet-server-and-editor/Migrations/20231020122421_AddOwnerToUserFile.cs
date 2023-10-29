using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SPEditor.Migrations
{
    /// <inheritdoc />
    public partial class AddOwnerToUserFile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "UserFile",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_UserFile_OwnerId",
                table: "UserFile",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserFile_AspNetUsers_OwnerId",
                table: "UserFile",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserFile_AspNetUsers_OwnerId",
                table: "UserFile");

            migrationBuilder.DropIndex(
                name: "IX_UserFile_OwnerId",
                table: "UserFile");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "UserFile");
        }
    }
}

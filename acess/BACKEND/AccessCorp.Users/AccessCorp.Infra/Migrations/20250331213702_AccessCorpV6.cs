using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccessCorpUsers.Infra.Migrations
{
    /// <inheritdoc />
    public partial class AccessCorpV6 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Administrators",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<byte[]>(
                name: "ImageUpload",
                table: "Administrators",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Image",
                table: "Administrators");

            migrationBuilder.DropColumn(
                name: "ImageUpload",
                table: "Administrators");
        }
    }
}

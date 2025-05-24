using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccessCorpUsers.Infra.Migrations
{
    /// <inheritdoc />
    public partial class AccessCorpV41 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "ImageUpload",
                table: "Residents",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUpload",
                table: "Residents");
        }
    }
}

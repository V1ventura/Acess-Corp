using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccessCorpUsers.Infra.Migrations
{
    /// <inheritdoc />
    public partial class AccessCorpV3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Cep",
                table: "Guests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CepGuest",
                table: "Guests",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cep",
                table: "Guests");

            migrationBuilder.DropColumn(
                name: "CepGuest",
                table: "Guests");
        }
    }
}

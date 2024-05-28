using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Data.Migrations
{
    public partial class Initial_Database : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    UserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecurityStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ConcurrencyStamp = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    TwoFactorEnabled = table.Column<bool>(type: "bit", nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(type: "datetimeoffset", nullable: true),
                    LockoutEnabled = table.Column<bool>(type: "bit", nullable: false),
                    AccessFailedCount = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "ProductTypes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ClaimType = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ClaimValue = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderKey = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProviderDisplayName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    RoleId = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LoginProvider = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Value = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Slug = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    CategoryId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Products_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ProductVariants",
                columns: table => new
                {
                    ProductId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ProductTypeId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Price = table.Column<int>(type: "int", nullable: false),
                    OriginalPrice = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVariants", x => new { x.ProductId, x.ProductTypeId });
                    table.ForeignKey(
                        name: "FK_ProductVariants_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductVariants_ProductTypes_ProductTypeId",
                        column: x => x.ProductTypeId,
                        principalTable: "ProductTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "Deleted", "IsActive", "ModifiedAt", "ModifiedBy", "Slug", "Title" },
                values: new object[,]
                {
                    { new Guid("2c8eb836-090b-4a18-a869-620d7f527180"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3229), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "movies", "Movies" },
                    { new Guid("a186203e-0d11-4c22-a45e-58ecfeed368f"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3225), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "books", "Books" },
                    { new Guid("c236f9f6-2c4c-4ba3-99ed-9cf81ee9bf46"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3231), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "video-games", "Video Games" }
                });

            migrationBuilder.InsertData(
                table: "ProductTypes",
                columns: new[] { "Id", "CreatedAt", "CreatedBy", "ModifiedAt", "ModifiedBy", "Name" },
                values: new object[,]
                {
                    { new Guid("43a56b31-2f02-4e9d-88b0-2b3ced2276ba"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3004), "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "Audiobook" },
                    { new Guid("7c604dd7-d603-4f6a-b5bf-f254bd812787"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3009), "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "VHS" },
                    { new Guid("934902b5-c2a2-4fbc-97c2-8887ed45d08e"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3015), "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "Xbox" },
                    { new Guid("b28481c3-51fb-4a94-8558-0ac0ebfb1607"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3002), "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "E-Book" },
                    { new Guid("dfd52a60-8ccf-4ac2-980c-14ddf41e9a18"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3006), "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "Stream" },
                    { new Guid("e21526c4-f78b-4eb5-8ae0-919633179582"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(2971), "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "Default" },
                    { new Guid("e2d9219f-c57b-4c59-bea0-6a3af2e655a5"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3011), "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "PC" },
                    { new Guid("f728c3bf-b4d8-41f6-93ab-7a91cba390be"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3013), "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "PlayStation" },
                    { new Guid("fbaeaba4-a5bc-487e-b0e5-0967ff543d5d"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3008), "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "Blu-ray" },
                    { new Guid("ff58b31e-53d5-4216-84a4-0566cb2e9b52"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3000), "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "Paperback" }
                });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "CategoryId", "CreatedAt", "CreatedBy", "Deleted", "Description", "ImageUrl", "IsActive", "ModifiedAt", "ModifiedBy", "Slug", "Title" },
                values: new object[,]
                {
                    { new Guid("00cab8fd-ad0e-433b-8bb0-2c9596809b7b"), new Guid("c236f9f6-2c4c-4ba3-99ed-9cf81ee9bf46"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3289), "", false, "Day of the Tentacle, also known as Maniac Mansion II: Day of the Tentacle, is a 1993 graphic adventure game developed and published by LucasArts. It is the sequel to the 1987 game Maniac Mansion.", "https://upload.wikimedia.org/wikipedia/en/7/79/Day_of_the_Tentacle_artwork.jpg", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "day-of-the-tentacle", "Day of the Tentacle" },
                    { new Guid("07acf5bd-e13d-4667-ba8e-70be6785f655"), new Guid("c236f9f6-2c4c-4ba3-99ed-9cf81ee9bf46"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3285), "", false, "Diablo II is an action role-playing hack-and-slash computer video game developed by Blizzard North and published by Blizzard Entertainment in 2000 for Microsoft Windows, Classic Mac OS, and macOS.", "https://upload.wikimedia.org/wikipedia/en/d/d5/Diablo_II_Coverart.png", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "diablo-ii", "Diablo II" },
                    { new Guid("106e97ab-bbce-44b8-95c4-a287752d8561"), new Guid("c236f9f6-2c4c-4ba3-99ed-9cf81ee9bf46"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3280), "", false, "Half-Life 2 is a 2004 first-person shooter game developed and published by Valve. Like the original Half-Life, it combines shooting, puzzles, and storytelling, and adds features such as vehicles and physics-based gameplay.", "https://upload.wikimedia.org/wikipedia/en/2/25/Half-Life_2_cover.jpg", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "half-life-2", "Half-Life 2" },
                    { new Guid("318f6a20-3c0b-40ca-9cf0-9533e83d3734"), new Guid("a186203e-0d11-4c22-a45e-58ecfeed368f"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3254), "", false, "The Hitchhiker's Guide to the Galaxy is a comedy science fiction franchise created by Douglas Adams. Originally a 1978 radio comedy broadcast on BBC Radio 4, it was later adapted to other formats, including novels, stage shows, comic books, a 1981 TV series, a 1984 text adventure game, and 2005 feature film.", "https://upload.wikimedia.org/wikipedia/en/b/bd/H2G2_UK_front_cover.jpg", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "the-hitchhikers-guide-to-the-galaxy", "The Hitchhiker's Guide to the Galaxy" },
                    { new Guid("321ec52d-5fb6-4b1b-bb35-6f73cf92396d"), new Guid("2c8eb836-090b-4a18-a869-620d7f527180"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3276), "", false, "Toy Story is a 1995 American computer-animated comedy film produced by Pixar Animation Studios and released by Walt Disney Pictures. The first installment in the Toy Story franchise, it was the first entirely computer-animated feature film, as well as the first feature film from Pixar. The film was directed by John Lasseter (in his feature directorial debut), and written by Joss Whedon, Andrew Stanton, Joel Cohen, and Alec Sokolow from a story by Lasseter, Stanton, Pete Docter, and Joe Ranft. The film features music by Randy Newman, was produced by Bonnie Arnold and Ralph Guggenheim, and was executive-produced by Steve Jobs and Edwin Catmull. The film features the voices of Tom Hanks, Tim Allen, Don Rickles, Wallace Shawn, John Ratzenberger, Jim Varney, Annie Potts, R. Lee Ermey, John Morris, Laurie Metcalf, and Erik von Detten. Taking place in a world where anthropomorphic toys come to life when humans are not present, the plot focuses on the relationship between an old-fashioned pull-string cowboy doll named Woody and an astronaut action figure, Buzz Lightyear, as they evolve from rivals competing for the affections of their owner, Andy Davis, to friends who work together to be reunited with Andy after being separated from him.", "https://upload.wikimedia.org/wikipedia/en/1/13/Toy_Story.jpg", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "toy-story", "Toy Story" },
                    { new Guid("4f5c260c-0870-4940-a394-b20c56b3fcca"), new Guid("2c8eb836-090b-4a18-a869-620d7f527180"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3267), "", false, "The Matrix is a 1999 science fiction action film written and directed by the Wachowskis, and produced by Joel Silver. Starring Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano, and as the first installment in the Matrix franchise, it depicts a dystopian future in which humanity is unknowingly trapped inside a simulated reality, the Matrix, which intelligent machines have created to distract humans while using their bodies as an energy source. When computer programmer Thomas Anderson, under the hacker alias \"Neo\", uncovers the truth, he \"is drawn into a rebellion against the machines\" along with other people who have been freed from the Matrix.", "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "the-matrix", "The Matrix" },
                    { new Guid("aed54a62-e6e7-4670-ab24-1c84b911deb0"), new Guid("c236f9f6-2c4c-4ba3-99ed-9cf81ee9bf46"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3296), "", false, "The Super Nintendo Entertainment System (SNES), also known as the Super NES or Super Nintendo, is a 16-bit home video game console developed by Nintendo that was released in 1990 in Japan and South Korea.", "https://upload.wikimedia.org/wikipedia/commons/e/ee/Nintendo-Super-Famicom-Set-FL.jpg", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "super-nintendo-entertainment-system", "Super Nintendo Entertainment System" },
                    { new Guid("c7537965-c2cb-4e77-bfc5-6c466c9a3bea"), new Guid("a186203e-0d11-4c22-a45e-58ecfeed368f"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3262), "", false, "Nineteen Eighty-Four (also published as 1984) is a dystopian novel and cautionary tale by English writer George Orwell. It was published on 8 June 1949 by Secker & Warburg as Orwell's ninth and final book completed in his lifetime. Thematically, it centres on the consequences of totalitarianism, mass surveillance and repressive regimentation of people and behaviours within society. Orwell, a democratic socialist, modelled the authoritarian state in the novel on the Soviet Union in the era of Stalinism, and Nazi Germany. More broadly, the novel examines the role of truth and facts within societies and the ways in which they can be manipulated.", "https://upload.wikimedia.org/wikipedia/en/5/51/1984_first_edition_cover.jpg", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "nineteen-eighty-four", "Nineteen Eighty-Four" },
                    { new Guid("ce50c69d-5897-4e3d-8d2d-081114ed1fb0"), new Guid("a186203e-0d11-4c22-a45e-58ecfeed368f"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3258), "", false, "Ready Player One is a 2011 science fiction novel, and the debut novel of American author Ernest Cline. The story, set in a dystopia in 2045, follows protagonist Wade Watts on his search for an Easter egg in a worldwide virtual reality game, the discovery of which would lead him to inherit the game creator's fortune. Cline sold the rights to publish the novel in June 2010, in a bidding war to the Crown Publishing Group (a division of Random House). The book was published on August 16, 2011. An audiobook was released the same day; it was narrated by Wil Wheaton, who was mentioned briefly in one of the chapters. In 2012, the book received an Alex Award from the Young Adult Library Services Association division of the American Library Association and won the 2011 Prometheus Award. A film adaptation, screenwritten by Cline and Zak Penn and directed by Steven Spielberg, was released on March 29, 2018. A sequel novel, Ready Player Two, was released on November 24, 2020, to a widely negative critical reception.", "https://upload.wikimedia.org/wikipedia/en/a/a4/Ready_Player_One_cover.jpg", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "ready-player-one", "Ready Player One" },
                    { new Guid("f2b7ac53-e3e5-4f7c-8094-99530bbde9eb"), new Guid("2c8eb836-090b-4a18-a869-620d7f527180"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3271), "", false, "Back to the Future is a 1985 American science fiction film directed by Robert Zemeckis. Written by Zemeckis and Bob Gale, it stars Michael J. Fox, Christopher Lloyd, Lea Thompson, Crispin Glover, and Thomas F. Wilson. Set in 1985, the story follows Marty McFly (Fox), a teenager accidentally sent back to 1955 in a time-traveling DeLorean automobile built by his eccentric scientist friend Doctor Emmett \"Doc\" Brown (Lloyd). Trapped in the past, Marty inadvertently prevents his future parents' meeting—threatening his very existence—and is forced to reconcile the pair and somehow get back to the future.", "https://upload.wikimedia.org/wikipedia/en/d/d2/Back_to_the_Future.jpg", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "back-to-the-future", "Back to the Future" },
                    { new Guid("fc67ff65-d124-4350-94fa-8dd1cc0559e1"), new Guid("c236f9f6-2c4c-4ba3-99ed-9cf81ee9bf46"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3293), "", false, "The Xbox is a home video game console and the first installment in the Xbox series of video game consoles manufactured by Microsoft.", "https://upload.wikimedia.org/wikipedia/commons/4/43/Xbox-console.jpg", true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", "xbox", "Xbox" }
                });

            migrationBuilder.InsertData(
                table: "ProductVariants",
                columns: new[] { "ProductId", "ProductTypeId", "CreatedAt", "CreatedBy", "Deleted", "IsActive", "ModifiedAt", "ModifiedBy", "OriginalPrice", "Price" },
                values: new object[,]
                {
                    { new Guid("00cab8fd-ad0e-433b-8bb0-2c9596809b7b"), new Guid("e2d9219f-c57b-4c59-bea0-6a3af2e655a5"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3351), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0, 149000 },
                    { new Guid("07acf5bd-e13d-4667-ba8e-70be6785f655"), new Guid("e2d9219f-c57b-4c59-bea0-6a3af2e655a5"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3349), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 249000, 99000 },
                    { new Guid("106e97ab-bbce-44b8-95c4-a287752d8561"), new Guid("934902b5-c2a2-4fbc-97c2-8887ed45d08e"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3346), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 59000, 49000 },
                    { new Guid("106e97ab-bbce-44b8-95c4-a287752d8561"), new Guid("e2d9219f-c57b-4c59-bea0-6a3af2e655a5"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3342), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 299000, 199000 },
                    { new Guid("106e97ab-bbce-44b8-95c4-a287752d8561"), new Guid("f728c3bf-b4d8-41f6-93ab-7a91cba390be"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3344), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0, 69000 },
                    { new Guid("318f6a20-3c0b-40ca-9cf0-9533e83d3734"), new Guid("43a56b31-2f02-4e9d-88b0-2b3ced2276ba"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3324), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 299000, 199000 },
                    { new Guid("318f6a20-3c0b-40ca-9cf0-9533e83d3734"), new Guid("b28481c3-51fb-4a94-8558-0ac0ebfb1607"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3322), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0, 79000 },
                    { new Guid("318f6a20-3c0b-40ca-9cf0-9533e83d3734"), new Guid("ff58b31e-53d5-4216-84a4-0566cb2e9b52"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3319), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 199000, 99000 },
                    { new Guid("321ec52d-5fb6-4b1b-bb35-6f73cf92396d"), new Guid("dfd52a60-8ccf-4ac2-980c-14ddf41e9a18"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3340), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0, 29000 },
                    { new Guid("4f5c260c-0870-4940-a394-b20c56b3fcca"), new Guid("7c604dd7-d603-4f6a-b5bf-f254bd812787"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3335), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0, 199000 },
                    { new Guid("4f5c260c-0870-4940-a394-b20c56b3fcca"), new Guid("dfd52a60-8ccf-4ac2-980c-14ddf41e9a18"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3331), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0, 39000 },
                    { new Guid("4f5c260c-0870-4940-a394-b20c56b3fcca"), new Guid("fbaeaba4-a5bc-487e-b0e5-0967ff543d5d"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3333), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0, 99000 },
                    { new Guid("aed54a62-e6e7-4670-ab24-1c84b911deb0"), new Guid("e21526c4-f78b-4eb5-8ae0-919633179582"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3355), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 13990000, 7990000 },
                    { new Guid("c7537965-c2cb-4e77-bfc5-6c466c9a3bea"), new Guid("ff58b31e-53d5-4216-84a4-0566cb2e9b52"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3329), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0, 69000 },
                    { new Guid("ce50c69d-5897-4e3d-8d2d-081114ed1fb0"), new Guid("ff58b31e-53d5-4216-84a4-0566cb2e9b52"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3326), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 149000, 79000 },
                    { new Guid("f2b7ac53-e3e5-4f7c-8094-99530bbde9eb"), new Guid("dfd52a60-8ccf-4ac2-980c-14ddf41e9a18"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3338), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 0, 39000 },
                    { new Guid("fc67ff65-d124-4350-94fa-8dd1cc0559e1"), new Guid("e21526c4-f78b-4eb5-8ae0-919633179582"), new DateTime(2024, 5, 27, 16, 45, 45, 558, DateTimeKind.Local).AddTicks(3353), "", false, true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "", 29900000, 15900000 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryId",
                table: "Products",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariants_ProductTypeId",
                table: "ProductVariants",
                column: "ProductTypeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "ProductVariants");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "ProductTypes");

            migrationBuilder.DropTable(
                name: "Categories");
        }
    }
}

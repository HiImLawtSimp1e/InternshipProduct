using Data.Entities;
using Data.Initialization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace Data.Context
{
    public class DataContext : IdentityDbContext<ApplicationUser>
    {
        public DataContext()
        {

        }

        public DataContext(DbContextOptions<DbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ProductVariant>()
             .HasKey(p => new { p.ProductId, p.ProductTypeId });
            builder.Entity<Customer>()
             .HasKey(c => new { c.AccountId });
            builder.Entity<Employee>()
             .HasKey(e => new { e.AccountId });

            Seed.SeedingData(builder);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("server=localhost; database=Internship_Proj; trusted_connection=true;");
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<ProductType> ProductTypes { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<Information> Information { get; set; }
        public DbSet<Account> Accounts { get; set; } 
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Role> Roles { get; set; }
    }
}

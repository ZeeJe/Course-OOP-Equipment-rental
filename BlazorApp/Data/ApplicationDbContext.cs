using Microsoft.EntityFrameworkCore;
using BlazorApp.Models;

namespace BlazorApp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Transport> Transports { get; set; }
        public DbSet<Bicycle> Bicycles { get; set; }
        public DbSet<Scooter> Scooters { get; set; }
        public DbSet<RentalSession> RentalSessions { get; set; }
        public DbSet<IssueReport> IssueReports { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Transport>().ToTable("Transports");
            modelBuilder.Entity<Bicycle>().ToTable("Bicycles");
            modelBuilder.Entity<Scooter>().ToTable("Scooters");
        }
    }
}
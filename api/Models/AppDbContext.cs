// In AppDbContext.cs
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using IdeaHub.Models;  // Make sure this using directive is present

namespace IdeaHub.Data
{
    public class AppDbContext : IdentityDbContext<User>  // Using User instead of IdeahubUser
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Idea> Ideas { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Reaction> Reactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            modelBuilder.Entity<Idea>()
                .HasOne(i => i.Author)
                .WithMany()
                .HasForeignKey(i => i.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
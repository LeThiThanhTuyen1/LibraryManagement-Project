using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LibraryManagementAPI.Models;

namespace LibraryManagementAPI.Data
{
    public class LibraryManagementAPIContext : DbContext
    {
        public LibraryManagementAPIContext(DbContextOptions<LibraryManagementAPIContext> options) : base(options) { }

        public DbSet<Book> Books { get; set; }
        public DbSet<Author> Authors { get; set; }
        public DbSet<BookAuthor> Book_Authors { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Publisher> Publishers { get; set; } 
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<BookReview> Book_Reviews { get; set; }
        public DbSet<Download> Downloads { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Major> Majors { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Lecturer> Lecturers { get; set; }
        public DbSet<LinkLibrary> LinkLibraries { get; set; }
        public DbSet<Document> Documents { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Cấu hình khóa chính cho bảng BookAuthor (bảng liên kết nhiều-nhiều)
            modelBuilder.Entity<BookAuthor>()
                .HasKey(ba => new { ba.book_id, ba.author_id });

        }
    }
}

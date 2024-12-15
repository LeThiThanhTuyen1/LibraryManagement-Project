using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagementAPI.Models
{
    public class Book
    {
        [Key]
        public int book_id { get; set; }

        [Required(ErrorMessage = "Title is required.")]
        public string? title { get; set; }

        [Required(ErrorMessage = "ISBN is required.")]
        public string? isbn { get; set; }

        [Column("publisher_id")]
        public int? PublisherId { get; set; } 
        [Range(1000, 3000, ErrorMessage = "Publication year must be between 1000 and 3000.")]
        public int? publication_year { get; set; } 

        public string? genre { get; set; } 
        public string? summary { get; set; } 

        public string? language { get; set; }

        public string? file_path { get; set; }

        public Publisher? Publisher { get; set; } 

        public string? accessLevel { get; set; } 
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LibraryManagementAPI.Models
{
    public class Book
    {
        [Key]
        public int book_id { get; set; }
        public string? title { get; set; }
        public string? isbn { get; set; }
        public int publication_year { get; set; }
        public string? genre { get; set; }
        public string? summary { get; set; }
        [Column("publisher_id")]
        public int PublisherId { get; set; }

        public string? language { get; set; }
        public string? file_path { get; set; }

        public required Publisher Publisher { get; set; }

        public string? accessLevel { get; set; }

    }
}

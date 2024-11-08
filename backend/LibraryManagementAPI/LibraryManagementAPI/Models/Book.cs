using System.ComponentModel.DataAnnotations;

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
        public int publisher_id { get; set; }
        public string? language { get; set; }
        public string? file_path { get; set; }

    }
}

using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class Author
    {
        [Key]
        public int author_id { get; set; }
        public string? first_name { get; set; }
        public string? last_name { get; set; } 
        public DateTime? birthdate { get; set; } 
        public string? nationality { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class BookReview
    {
        [Key]
        public int review_id { get; set; }
        public int book_id { get; set; }
        public int iser_id { get; set; }
        public int rating { get; set; }
        public string? review_text { get; set; }
        public DateTime review_date { get; set; }
    }

}

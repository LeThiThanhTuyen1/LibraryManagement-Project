using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class Favorite
    {
        [Key]
        public int favorite_id { get; set; }
        public int book_id { get; set; }
        public int user_id { get; set; }
        public DateTime added_date { get; set; }

    }

}

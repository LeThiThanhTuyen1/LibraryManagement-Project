using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class Download
    {
        [Key]
        public int download_d { get; set; }
        public int book_id { get; set; }
        public int user_id { get; set; }
        public DateTime download_date { get; set; }

    }

}

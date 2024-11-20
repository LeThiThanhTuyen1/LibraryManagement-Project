using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class Lecturer
    {
        [Key]
        public int lecturer_id { get; set; }
        public int user_id { get; set; }
        public int major_id { get; set; }
        public string? position { get; set; }
        public int start_year { get; set; }

    }

}

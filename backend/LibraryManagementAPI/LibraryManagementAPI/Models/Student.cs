using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class Student
    {
        [Key]
        public int student_id { get; set; }
        public int user_id { get; set; }
        public int major_id { get; set; }
        public string? course { get; set; }
        public int enrollment_year { get; set; }
    }

}

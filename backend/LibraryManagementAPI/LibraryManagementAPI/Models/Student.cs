using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class Student
    {
        [Key]
        public int student_d { get; set; }
        public int iser_id { get; set; }
        public int major_id { get; set; }
        public string course { get; set; }
        public int rnrollment_year { get; set; }
    }

}

using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class Department
    {
        [Key]
        public int department_id { get; set; }
        public string department_name { get; set; }

    }

}

using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class Major
    {
        [Key]
        public int major_id { get; set; }
        public string major_name { get; set; }
        public int department_id { get; set; }

    }

}

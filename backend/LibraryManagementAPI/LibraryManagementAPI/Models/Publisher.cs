using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class Publisher
    {
        [Key]
        public int publisher_id { get; set; }
        public string name { get; set; }
        public string address { get; set; }
    }

}

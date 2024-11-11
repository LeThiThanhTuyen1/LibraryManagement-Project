using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class LinkLibrary
    {
        [Key]
        public int link_id { get; set; }
        public string?  ten_thuvien{ get; set; }
        public string? link_text {  get; set; }
        public DateTime date_at {  get; set; }
    }
}

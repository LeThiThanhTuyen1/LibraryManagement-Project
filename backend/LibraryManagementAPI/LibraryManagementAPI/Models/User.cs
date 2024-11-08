using System.ComponentModel.DataAnnotations;

namespace LibraryManagementAPI.Models
{
    public class User
    {
        [Key]
        public int user_id { get; set; }
        public string? username { get; set; }
        public string? password_hash { get; set; }
        public string? first_name { get; set; }
        public string? last_name { get; set; }
        public string? role { get; set; }
        public string? email { get; set; }
        public string? phone_number { get; set; }

    }

}

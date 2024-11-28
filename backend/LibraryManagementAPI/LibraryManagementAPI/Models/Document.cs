namespace LibraryManagementAPI.Models
{
    public class Document
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public string SenderName { get; set; }
        public string Role { get; set; }
        public string Department { get; set; }
        public string Major { get; set; }
        public DateTime UploadDate { get; set; }
        public string Status { get; set; }
        //public int UserId { get; set; } // Thêm thuộc tính UserId

        //// Điều này giúp khai báo quan hệ với bảng User (1-n relationship)
        //public User User { get; set; }
    }

}

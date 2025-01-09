namespace LibraryManagementAPI.Models
{
    public class DocumentUploadRequest
    {
        public int? user_id{ get; set; }
        public string? title { get; set; }
        public int? publication_year { get; set; }
        public string? genre { get; set; }
        public string? summary { get; set; }
        public string? language { get; set; }
        public IFormFile File { get; set; }
    }
}

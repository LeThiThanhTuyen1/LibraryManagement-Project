namespace LibraryManagementAPI.Models
{
    public class DocumentUploadRequest
    {
        public string? Title { get; set; }
        public int? Publication_year { get; set; }
        public string? Genre { get; set; }
        public string? Summary { get; set; }
        public string? Language { get; set; }
        public IFormFile File { get; set; }
    }
}

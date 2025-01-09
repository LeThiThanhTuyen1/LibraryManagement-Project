using LibraryManagementAPI.Models;

public class Document
{
    public int Id { get; set; }
    public string? file_name { get; set; }
    public string? file_path { get; set; }
    public DateTime? upload_date { get; set; }
    public string? status { get; set; }
    public string? title { get; set; }
    public string? isbn { get; set; }
    public int? publication_year { get; set; }
    public string? genre { get; set; }
    public string? summary { get; set; }
    public string? language { get; set; }
    public int? user_id { get; set; }
}


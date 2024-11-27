namespace LibraryManagementAPI.Models
{
    public class ResetPasswordRequest
    {
        public string? Email { get; set; }
        public string? VerificationCode { get; set; }
        public string? NewPassword { get; set; }
    }
}

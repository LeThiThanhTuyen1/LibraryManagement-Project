﻿using System;
using System.Collections.Generic;
using System.Linq;
using BCrypt.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryManagementAPI.Data;
using LibraryManagementAPI.Models;
using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;  // Thêm namespace này để sử dụng IConfiguration

namespace LibraryManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly LibraryManagementAPIContext _context;
        private static Dictionary<string, string> verificationCodes = new Dictionary<string, string>(); // Lưu mã xác thực
        private readonly IConfiguration _configuration;  
        private readonly string _uploadPath;

        public UsersController(LibraryManagementAPIContext context, IConfiguration configuration)  // Thêm IConfiguration vào constructor
        {
            _context = context;
            _configuration = configuration;  
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.user_id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
            user.password_hash = BCrypt.Net.BCrypt.HashPassword(user.password_hash);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.user_id }, user);
        }

        // DELETE: api/Users/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] User loginModel)
        {
            // Tìm người dùng theo username
            var user = await _context.Users.FirstOrDefaultAsync(u => u.username == loginModel.username);

            if (user == null)
            {
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng." });
            }

            // So sánh mật khẩu gốc (loginModel.password) với mật khẩu đã mã hóa (user.password_hash)
            if (!BCrypt.Net.BCrypt.Verify(loginModel.password_hash, user.password_hash))  // Đảm bảo loginModel.password là mật khẩu gốc
            {
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không đúng." });
            }

            // Đăng nhập thành công
            return Ok(new
            {
                user.user_id,
                user.username,
                user.first_name,
                user.last_name,
                user.role,
                user.email,
                user.phone_number
            });
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.user_id == id);
        }

        // Thêm phương thức ChangePassword vào controller
        [HttpPut("change-password/{id}")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] ChangePasswordRequest changePasswordRequest)
        {
            // Tìm người dùng theo id
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Người dùng không tồn tại." });
            }

            // Kiểm tra mật khẩu cũ
            if (!BCrypt.Net.BCrypt.Verify(changePasswordRequest.OldPassword, user.password_hash))
            {
                return Unauthorized(new { message = "Mật khẩu cũ không chính xác." });
            }


            // Kiểm tra mật khẩu mới và xác nhận mật khẩu
            if (changePasswordRequest.NewPassword != changePasswordRequest.ConfirmPassword)
            {
                return BadRequest(new { message = "Nhập lại mật khẩu mới không đúng" });
            }

            // Kiểm tra tính mạnh mẽ của mật khẩu mới 
            if (!IsPasswordStrong(changePasswordRequest.NewPassword))
            {
                return BadRequest(new { message = "Mật khẩu mới không đủ mạnh. Yêu cầu có độ dài tối thiểu 8 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt." });
            }

            
            // Cập nhật mã hóa mật khẩu mới
            user.password_hash = BCrypt.Net.BCrypt.HashPassword(changePasswordRequest.NewPassword, BCrypt.Net.BCrypt.GenerateSalt());

            // Lưu thay đổi
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đổi mật khẩu thành công." });
        }

        // Phương thức kiểm tra mật khẩu mạnh
        private bool IsPasswordStrong(string password)
        {
            // Kiểm tra mật khẩu có ít nhất 8 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt
            var hasUpperChar = password.Any(c => char.IsUpper(c));
            var hasLowerChar = password.Any(c => char.IsLower(c));
            var hasDigit = password.Any(c => char.IsDigit(c));
            var hasSpecialChar = password.Any(c => "!@#$%^&*()_+-=[]{}|;:'\",.<>?".Contains(c));
            var isLongEnough = password.Length >= 8;

            return hasUpperChar && hasLowerChar && hasDigit && hasSpecialChar && isLongEnough;
        }

        // API để yêu cầu mã xác thực
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.Email);
            if (user == null)
            {
                return NotFound(new { message = "Email không tồn tại." });
            }

            // Tạo mã xác thực ngẫu nhiên
            var verificationCode = new Random().Next(100000, 999999).ToString();

            // Lưu mã xác thực
            verificationCodes[user.email] = verificationCode;

            // Gửi mã qua email
            var result = await SendVerificationCodeEmail(user.email, verificationCode);

            if (result)
            {
                return Ok(new { message = "Mã xác thực đã được gửi tới email của bạn." });
            }
            else
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Gửi email không thành công." });
            }
        }

        // API để xác minh mã và thay đổi mật khẩu
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            // Kiểm tra mã xác thực
            if (verificationCodes.ContainsKey(request.Email) && verificationCodes[request.Email] == request.VerificationCode)
            {
                // Tìm người dùng theo email
                var user = await _context.Users.FirstOrDefaultAsync(u => u.email == request.Email);
                if (user == null)
                {
                    return NotFound(new { message = "Email không tồn tại." });
                }

                // Kiểm tra tính mạnh mẽ của mật khẩu mới
                if (!IsPasswordStrong(request.NewPassword))
                {
                    return BadRequest(new { message = "Mật khẩu mới không đủ mạnh. Yêu cầu có độ dài tối thiểu 8 ký tự, chứa chữ hoa, chữ thường, số và ký tự đặc biệt." });
                }

                // Mã hóa mật khẩu mới
                user.password_hash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

                // Cập nhật mật khẩu
                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                // Xóa mã xác thực đã sử dụng
                verificationCodes.Remove(request.Email);

                return Ok(new { message = "Mật khẩu đã được thay đổi thành công." });
            }
            else
            {
                return Unauthorized(new { message = "Mã xác thực không hợp lệ." });
            }
        }

        [HttpGet("GetUserById/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.user_id == id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }
            return Ok(user);
        }

       [HttpPut("UpdateUser")]
        public async Task<IActionResult> UpdateUser([FromBody] User userDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.user_id == userDto.user_id);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            if (userDto.phone_number == null)
            {
                return NotFound(new { message = "Phone number is null" });
            }

            user.email = userDto.email;
            user.phone_number = userDto.phone_number;

            await _context.SaveChangesAsync();
            return Ok(new { message = "User updated successfully" });
        }

        // Phương thức gửi mã xác thực qua email sử dụng Gmail SMTP
        private async Task<bool> SendVerificationCodeEmail(string email, string verificationCode)
        {
            // Lấy thông tin từ Configuration
            var gmailUsername = _configuration["GmailUsername"];  
            var gmailAppPassword = _configuration["GmailAppPassword"];  

            try
            {
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(gmailUsername, gmailAppPassword), 
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("highlight056@gmail.com"),
                    Subject = "Mã xác thực để đổi mật khẩu",
                    Body = $"Mã xác thực của bạn là: {verificationCode}",
                    IsBodyHtml = false,
                };
                mailMessage.To.Add(email);

                // Gửi email bất đồng bộ
                await smtpClient.SendMailAsync(mailMessage);

                return true;
            }
            catch (Exception ex)
            {
                // Ghi lại lỗi chi tiết
                Console.WriteLine($"Lỗi khi gửi email: {ex.Message}");
                Console.WriteLine($"StackTrace: {ex.StackTrace}");
                return false;
            }
        }

        [HttpGet("LibraryUsersCount")]
        public async Task<IActionResult> GetLibraryUsersCount()
        {
            var count = await _context.Users.CountAsync();
            return Ok(count);
        }

        [HttpGet("GetDocumentsByUser/{userId}")]
        public async Task<IActionResult> GetDocumentsByUser(int userId)
        {
            var documents = await _context.Documents
                .Where(d => d.user_id == userId)
                .Select(d => new
                {
                    d.Id,
                    d.file_name,
                    d.upload_date,
                    d.status
                })
                .ToListAsync();

            return Ok(documents);
        }



    }
}
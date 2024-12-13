using LibraryManagementAPI.Data;
using LibraryManagementAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookAdminController : ControllerBase
    {
        private readonly LibraryManagementAPIContext _context;
        private readonly IWebHostEnvironment _environment;

        public BookAdminController(LibraryManagementAPIContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // API thêm sách
        [HttpPost("add")]
        public async Task<IActionResult> AddBook([FromForm] Book book, [FromForm] List<Author>? authors, IFormFile? file)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Xử lý file tải lên (nếu có)
            if (file != null && file.Length > 0)
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, file.FileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                book.file_path = $"uploads/{file.FileName}";
            }

            // Xử lý Publisher (nếu có)
            if (book.Publisher != null && !string.IsNullOrWhiteSpace(book.Publisher.name))
            {
                var publisher = await _context.Publishers.FirstOrDefaultAsync(p => p.name == book.Publisher.name);
                if (publisher == null)
                {
                    publisher = new Publisher
                    {
                        name = book.Publisher.name,
                        address = book.Publisher.address
                    };
                    _context.Publishers.Add(publisher);
                    await _context.SaveChangesAsync();
                }
                book.Publisher = publisher;
            }

            // Xử lý Authors (nếu có)
            if (authors != null && authors.Any())
            {
                foreach (var author in authors)
                {
                    var existingAuthor = await _context.Authors.FirstOrDefaultAsync(a =>
                        a.first_name == author.first_name && a.last_name == author.last_name);

                    if (existingAuthor == null)
                    {
                        _context.Authors.Add(author);
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        author.author_id = existingAuthor.author_id;
                    }

                    // Tạo liên kết giữa Book và Author
                    var bookAuthor = new BookAuthor
                    {
                        book_id = book.book_id,
                        author_id = author.author_id
                    };
                    _context.Book_Authors.Add(bookAuthor);
                }
            }

            // Lưu Book vào cơ sở dữ liệu
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Thêm sách thành công!", data = book });
        }

    }
}

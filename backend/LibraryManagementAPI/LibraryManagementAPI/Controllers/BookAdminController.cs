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
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Không có file nào được chọn.");
            }

            var filePath = Path.Combine(_environment.WebRootPath, "uploads", file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Trả về URL hoặc thông tin của file
            return Ok(new { fileUrl = $"{file.FileName}" });
        }

        // API thêm sách
        [HttpPost("add")]
        public async Task<IActionResult> AddBook([FromForm] Book book, [FromForm] List<string>? authorNames, IFormFile? file)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { error = "Invalid data", details = ModelState });
            }

            // Xử lý file tải lên (nếu có)
            if (file != null && file.Length > 0)
            {
                var uploadsFolder = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = $"{file.FileName}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }
                book.file_path = uniqueFileName;
            }

            // Xử lý Nhà xuất bản (Publisher)
            Publisher? publisher = null;
            if (book.Publisher != null && !string.IsNullOrWhiteSpace(book.Publisher.name))
            {
                publisher = await _context.Publishers.FirstOrDefaultAsync(p => p.name == book.Publisher.name);
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
            // Lưu thông tin sách
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            // Xử lý Tác giả (AuthorNames)
            var authorDetails = new List<object>();
            if (authorNames != null && authorNames.Any())
            {
                foreach (var fullname in authorNames)
                {
                    if (string.IsNullOrWhiteSpace(fullname))
                    {
                        continue; // Bỏ qua nếu không có tên tác giả
                    }

                    // Tách fullname thành first_name và last_name
                    var nameParts = fullname.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);
                    var first_name = nameParts.Length > 1 ? string.Join(" ", nameParts.Take(nameParts.Length - 1)) : fullname;
                    var last_name = nameParts.Length > 1 ? nameParts.Last() : string.Empty;

                    var existingAuthor = await _context.Authors.FirstOrDefaultAsync(a =>
                        a.first_name == first_name && a.last_name == last_name);

                    Author author;
                    if (existingAuthor == null)
                    {
                        author = new Author
                        {
                            first_name = first_name,
                            last_name = last_name
                        };
                        _context.Authors.Add(author);
                        await _context.SaveChangesAsync();

                        authorDetails.Add(new
                        {
                            Status = "Added",
                            AuthorId = author.author_id,
                            FullName = fullname
                        });
                    }
                    else
                    {
                        author = existingAuthor;
                        authorDetails.Add(new
                        {
                            Status = "Existing",
                            AuthorId = author.author_id,
                            FullName = fullname
                        });
                    }

                    // Tạo liên kết giữa Book và Author
                    if (!_context.Book_Authors.Any(ba => ba.book_id == book.book_id && ba.author_id == author.author_id))
                    {
                        var bookAuthor = new BookAuthor
                        {
                            book_id = book.book_id,
                            author_id = author.author_id
                        };
                        _context.Book_Authors.Add(bookAuthor);
                        await _context.SaveChangesAsync();
                    }
                }
            }

           

            // Phản hồi với thông tin đầy đủ
            return Ok(new
            {
                message = "Thêm sách thành công!",
                BookDetails = new
                {
                    BookId = book.book_id,
                    Title = book.title,
                    ISBN = book.isbn,
                    PublicationYear = book.publication_year,
                    Genre = book.genre,
                    Summary = book.summary,
                    Language = book.language,
                    FilePath = book.file_path,
                    Publisher = publisher != null
                        ? new
                        {
                            PublisherId = publisher.publisher_id,
                            PublisherName = publisher.name
                        }
                        : null,
                    Authors = authorDetails
                }
            });
        }

    }
}
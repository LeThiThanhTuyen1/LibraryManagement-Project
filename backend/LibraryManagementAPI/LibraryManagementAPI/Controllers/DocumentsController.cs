using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryManagementAPI.Data;
using LibraryManagementAPI.Models;
using Microsoft.AspNetCore.Authorization;

namespace LibraryManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DocumentsController : ControllerBase
    {
        private readonly LibraryManagementAPIContext _context;
        private readonly IConfiguration _configuration;
        private readonly string _uploadPath;

        public DocumentsController(LibraryManagementAPIContext context, IConfiguration configuration)  // Thêm IConfiguration vào constructor
        {
            _context = context;
            _configuration = configuration;
            _uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        // GET: api/Documents
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Document>>> GetDocuments()
        {
            return await _context.Documents.ToListAsync();
        }

        // GET: api/Documents/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Document>> GetDocument(int id)
        {
            var document = await _context.Documents.FindAsync(id);

            if (document == null)
            {
                return NotFound();
            }

            return document;
        }

        // PUT: api/Documents/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDocument(int id, Document document)
        {
            if (id != document.Id)
            {
                return BadRequest();
            }

            _context.Entry(document).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocumentExists(id))
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

        // POST: api/Documents
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Document>> PostDocument(Document document)
        {
            _context.Documents.Add(document);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDocument", new { id = document.Id }, document);
        }

        // DELETE: api/Documents/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDocument(int id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null)
            {
                return NotFound();
            }

            _context.Documents.Remove(document);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DocumentExists(int id)
        {
            return _context.Documents.Any(e => e.Id == id);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadDocument([FromForm] DocumentUploadRequest model)
        {
            try
            {
                if (model.File == null || model.File.Length == 0)
                    return BadRequest("File không hợp lệ.");

                var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
                if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

                var filePath = Path.Combine(uploadsFolder, model.File.FileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.File.CopyToAsync(stream);
                }

                var document = new Document
                {
                    user_id = model.user_id, // Map giá trị user_id từ model
                    file_name = model.File.FileName,
                    file_path = filePath,
                    title = model.title,
                    publication_year = model.publication_year,
                    genre = model.genre,
                    summary = model.summary,
                    language = model.language,
                    upload_date = DateTime.UtcNow,
                    status = "chờ duyệt"
                };

                _context.Documents.Add(document);
                await _context.SaveChangesAsync();

                return Ok("Tài liệu đã được tải lên thành công!");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message} - {ex.InnerException?.Message}");
                return StatusCode(500, $"Đã xảy ra lỗi: {ex.Message}");
            }
        }

        [HttpPost("{id}/approve")]
        public async Task<IActionResult> ApproveDocument(int id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null)
            {
                return NotFound("Tài liệu không tồn tại.");
            }

            // Thêm tài liệu vào bảng Books
            var book = new Book
            {
                title = document.title,
                isbn = document.isbn,
                publication_year = document.publication_year,
                genre = document.genre,
                summary = document.summary,
                language = document.language,
                file_path = document.file_path,
                accessLevel = "Public" // Giá trị mặc định
            };

            _context.Books.Add(book);

            // Cập nhật trạng thái tài liệu
            document.status = "đã duyệt";

            await _context.SaveChangesAsync();

            return Ok("Tài liệu đã được duyệt và thêm vào bảng Books.");
        }

        [HttpPost("{id}/reject")]
        public async Task<IActionResult> RejectDocument(int id)
        {
            var document = await _context.Documents.FindAsync(id);
            if (document == null)
            {
                return NotFound("Tài liệu không tồn tại.");
            }

            // Cập nhật trạng thái tài liệu
            document.status = "từ chối";

            await _context.SaveChangesAsync();

            return Ok("Tài liệu đã bị từ chối.");
        }

        [HttpGet("ViewDocument/{documentId}")]
        [AllowAnonymous]
        public async Task<IActionResult> ViewDocument(int documentId)
        {
            var document = await _context.Documents.FirstOrDefaultAsync(d => d.Id == documentId);

            if (document == null || string.IsNullOrEmpty(document.file_path))
            {
                return NotFound(new { message = "Document not found." });
            }

            // Tạo đường dẫn đầy đủ đến file tài liệu
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), document.file_path);

            // Kiểm tra xem file có tồn tại không
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { message = "File does not exist on server." });
            }

            // Xác định loại MIME của file (PDF, DOCX, TXT, ...)
            var fileExtension = Path.GetExtension(filePath).ToLowerInvariant();
            string mimeType = fileExtension switch
            {
                ".pdf" => "application/pdf",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".txt" => "text/plain",
                _ => "application/octet-stream"
            };

            // Đọc file và trả về dưới dạng file response
            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(fileBytes, mimeType);
        }


    }
}

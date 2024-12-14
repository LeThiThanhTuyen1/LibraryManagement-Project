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
    public class BooksController : ControllerBase
    {
        private readonly LibraryManagementAPIContext _context;

        public BooksController(LibraryManagementAPIContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
            return await _context.Books.Include(b => b.Publisher).ToListAsync();
        }
        
        [HttpGet("GetAllBooks")]
        public async Task<IActionResult> GetAllBooks()
        {
            var books = await _context.Books
                .Include(b => b.Publisher)
                .GroupJoin(_context.Book_Authors,
                    book => book.book_id,
                    bookAuthor => bookAuthor.book_id,
                    (book, bookAuthors) => new { book, bookAuthors })
                .SelectMany(
                    x => x.bookAuthors.DefaultIfEmpty(),
                    (x, bookAuthor) => new { x.book, authorId = bookAuthor != null ? bookAuthor.author_id : 0 })
                .GroupJoin(_context.Authors,
                    combined => combined.authorId,
                    author => author.author_id,
                    (combined, authors) => new { combined.book, authors })
                .SelectMany(
                    x => x.authors.DefaultIfEmpty(),
                    (x, author) => new
                    {
                        x.book.book_id,
                        x.book.title,
                        x.book.isbn,
                        x.book.publication_year,
                        x.book.genre,
                        x.book.summary,
                        x.book.language,
                        x.book.file_path,
                        PublisherName = x.book.Publisher != null ? x.book.Publisher.name : null,
                        AuthorName = author != null ? author.first_name + " " + author.last_name : null,
                        AuthorNationality = author != null ? author.nationality : null,
                        AuthorBirthdate = author != null ? author.birthdate : null,
                        x.book.accessLevel
                    })
                .ToListAsync();

            return Ok(books);
        }

        // GET: api/Books/5
        [HttpGet("GetBookById/{bookId}")]
        public async Task<IActionResult> GetBookById(int bookId)
        {
            var book = await _context.Books
                .Include(b => b.Publisher) 
                .Join(_context.Book_Authors,
                      b => b.book_id,
                      ba => ba.book_id,
                      (b, ba) => new { b, ba.author_id })
                .Join(_context.Authors,
                      combined => combined.author_id,
                      a => a.author_id,
                      (combined, a) => new
                      {
                          combined.b.book_id,
                          combined.b.title,
                          combined.b.isbn,
                          combined.b.publication_year,
                          combined.b.genre,
                          combined.b.summary,
                          combined.b.language,
                          combined.b.file_path,
                          combined.b.accessLevel,
                          PublisherName = combined.b.Publisher.name,
                          AuthorName = a.first_name + " " + a.last_name,
                          AuthorNationality = a.nationality,
                          AuthorBirthdate = a.birthdate,
                          AverageRating = _context.Book_Reviews
                        .Where(r => r.book_id == bookId )
                        .Average(r => (double?)r.rating) ?? 0
                      })
                .FirstOrDefaultAsync(b => b.book_id == bookId); // Lọc theo book_id

            if (book == null)
            {
                return NotFound(new { message = "Book not found." });
            }

            return Ok(book);
        }

        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, Book book)
        {
            if (id != book.book_id)
            {
                return BadRequest();
            }

            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
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

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Book>> PostBook(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBook", new { id = book.book_id }, book);
        }

        // DELETE: api/Books/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound(new { message = "Book not found." });
            }

            if (!string.IsNullOrEmpty(book.file_path))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", book.file_path);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Book deleted successfully." });
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.book_id == id);
        }

        [HttpGet("GetBookFile/{bookId}")]
        public IActionResult GetBookFile(int bookId)
        {
            var book = _context.Books.FirstOrDefault(b => b.book_id == bookId);

            if (book == null || string.IsNullOrEmpty(book.file_path))
            {
                return NotFound(new { message = "File not found." });
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", book.file_path);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { message = "File does not exist on server." });
            }

            var fileExtension = Path.GetExtension(filePath).ToLowerInvariant();
            string mimeType = fileExtension switch
            {
                ".pdf" => "application/pdf",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                ".txt" => "text/plain",
                _ => "application/octet-stream"
            };

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, mimeType, $"{book.title}{fileExtension}");
        }
        
        [HttpPut("UpdateAccessLevel/{bookId}")]
        public async Task<IActionResult> UpdateAccessLevel(int bookId, [FromBody] dynamic requestBody)
        {
            string newAccessLevel = requestBody?.accessLevel;
            var book = await _context.Books.FindAsync(bookId);
            if (book == null)
            {
                return NotFound(new { message = "Book not found." });
            }
            book.accessLevel = newAccessLevel;
            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Access level updated successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to update access level.", error = ex.Message });
            }
        }
    

        [HttpGet("GetGenres")]
         public async Task<IActionResult> GetGenres()
         {
             var genres = await _context.Books
                 .Select(b => b.genre)
                 .Distinct()
                 .ToListAsync();
        
             return Ok(genres);
         }

        [HttpGet("ViewDocument/{bookId}")]
        [AllowAnonymous]
        public async Task<IActionResult> ViewDocument(int bookId)
        {
            var book = await _context.Books.FirstOrDefaultAsync(b => b.book_id == bookId);

            if (book == null || string.IsNullOrEmpty(book.file_path))
            {
                return NotFound(new { message = "Document not found." });
            }

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Uploads", book.file_path);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { message = "File does not exist on server." });
            }

            var fileExtension = Path.GetExtension(filePath).ToLowerInvariant();
            string mimeType = fileExtension switch
            {
                ".pdf" => "application/pdf",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                ".txt" => "text/plain",
                _ => "application/octet-stream"
            };

            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            return File(fileBytes, mimeType);
        }

    }
}



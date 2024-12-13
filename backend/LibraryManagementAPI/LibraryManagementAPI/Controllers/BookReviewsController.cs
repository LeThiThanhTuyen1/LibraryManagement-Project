using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryManagementAPI.Data;
using LibraryManagementAPI.Models;

namespace LibraryManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookReviewsController : ControllerBase
    {
        private readonly LibraryManagementAPIContext _context;

        public BookReviewsController(LibraryManagementAPIContext context)
        {
            _context = context;
        }

        // GET: api/BookReviews
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookReview>>> GetBook_Reviews()
        {
            return await _context.Book_Reviews.ToListAsync();
        }

        // GET: api/BookReviews/5
        [HttpGet("{id}")]
        public async Task<ActionResult<BookReview>> GetBookReview(int id)
        {
            var bookReview = await _context.Book_Reviews.FindAsync(id);

            if (bookReview == null)
            {
                return NotFound();
            }

            return bookReview;
        }

        // GET: api/BookReviews/book_id/5
        [HttpGet("book_id/{book_id}")]
        public async Task<ActionResult<IEnumerable<BookReview>>> GetBookReviewsByBookId(int book_id)
        {
            if (book_id <= 0)
            {
                return BadRequest("Invalid book id");
            }

            var bookReviews = await _context.Book_Reviews
                                            .Where(r => r.book_id == book_id)
                                            .ToListAsync();

            if (bookReviews == null || !bookReviews.Any())
            {
                return NotFound("No reviews found for this book");
            }

            return Ok(bookReviews);
        }

        // PUT: api/BookReviews/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBookReview(int id, BookReview bookReview)
        {
            if (id != bookReview.review_id)
            {
                return BadRequest();
            }

            _context.Entry(bookReview).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookReviewExists(id))
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

        // POST: api/BookReviews
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<BookReview>> PostBookReview(BookReview bookReview)
        {
            var existingReview = await _context.Book_Reviews
                .FirstOrDefaultAsync(r => r.book_id == bookReview.book_id && r.user_id == bookReview.user_id);

            if (existingReview != null)
            {
                return Conflict(new { message = "Người dùng đã đánh giá sách này." });
            }

            _context.Book_Reviews.Add(bookReview);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBookReview", new { id = bookReview.review_id }, bookReview);
        }

        // DELETE: api/BookReviews/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBookReview(int id)
        {
            var bookReview = await _context.Book_Reviews.FindAsync(id);
            if (bookReview == null)
            {
                return NotFound();
            }

            _context.Book_Reviews.Remove(bookReview);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        [HttpDelete("delete/{book_id}/{user_id}")]
        public async Task<IActionResult> DeleteReviewByUser(int book_id, int user_id)
        {
            var review = await _context.Book_Reviews
                                        .FirstOrDefaultAsync(r => r.book_id == book_id && r.user_id == user_id);

            if (review == null)
            {
                return NotFound(new { message = "Không tìm thấy đánh giá của người dùng này." });
            }

            _context.Book_Reviews.Remove(review);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // GET: api/BookReviews/user_reviewed/{book_id}/{user_id}
        [HttpGet("user_reviewed/{book_id}/{user_id}")]
        public async Task<ActionResult<BookReview>> GetUserReview(int book_id, int user_id)
        {
            var userReview = await _context.Book_Reviews
                .FirstOrDefaultAsync(r => r.book_id == book_id && r.user_id == user_id);

            if (userReview == null)
            {
                return NotFound(new { message = "Người dùng chưa đánh giá sách này." });
            }

            return Ok(userReview);
        }


        private bool BookReviewExists(int id)
        {
            return _context.Book_Reviews.Any(e => e.review_id == id);
        }
    }
}

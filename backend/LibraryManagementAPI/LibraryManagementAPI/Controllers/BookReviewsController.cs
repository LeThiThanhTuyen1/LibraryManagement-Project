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

        private bool BookReviewExists(int id)
        {
            return _context.Book_Reviews.Any(e => e.review_id == id);
        }
    }
}

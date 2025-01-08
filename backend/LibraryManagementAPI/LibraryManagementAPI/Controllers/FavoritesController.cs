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
    public class FavoritesController : ControllerBase
    {
        private readonly LibraryManagementAPIContext _context;

        public FavoritesController(LibraryManagementAPIContext context)
        {
            _context = context;
        }

        [HttpGet("GetFavoritesByUser/{userId}")]
        public async Task<IActionResult> GetFavoritesByUser(int userId)
        {
            var favorites = await _context.Favorites
                .Where(f => f.user_id == userId)
                .Join(_context.Books,
                      fav => fav.book_id,
                      book => book.book_id,
                      (fav, book) => new
                      {
                          fav.favorite_id,
                          fav.book_id,
                          fav.user_id,
                          fav.added_date,
                          book.title,
                          book.Publisher.name
                      }).ToListAsync();

            return Ok(favorites);
        }

        // POST: api/Favorites
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Favorite>> PostFavorite(Favorite favorite)
        {
            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFavorite", new { id = favorite.favorite_id }, favorite);
        }

        // DELETE: api/Favorites/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFavorite(int id)
        {
            var favorite = await _context.Favorites.FindAsync(id);
            if (favorite == null)
            {
                return NotFound();
            }

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("RemoveFavoriteByBookId/{bookId}")]
        public async Task<IActionResult> RemoveFavoriteByBookId(int bookId)
        {
            // Tìm tất cả các mục yêu thích có book_id tương ứng
            var favoritesToRemove = await _context.Favorites
                                                .Where(f => f.book_id == bookId)
                                                .ToListAsync();
            
            if (favoritesToRemove == null || favoritesToRemove.Count == 0)
            {
                return NotFound("Không tìm thấy mục yêu thích nào cho sách này.");
            }

            // Xóa tất cả các mục yêu thích liên quan đến book_id
            _context.Favorites.RemoveRange(favoritesToRemove);
            await _context.SaveChangesAsync();

            return NoContent(); 
        }

        private bool FavoriteExists(int id)
        {
            return _context.Favorites.Any(e => e.favorite_id == id);
        }
    }
}

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
    public class DownloadsController : ControllerBase
    {
        private readonly LibraryManagementAPIContext _context;

        public DownloadsController(LibraryManagementAPIContext context)
        {
            _context = context;
        }

        // GET: api/Downloads
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Download>>> GetDownloads()
        {
            return await _context.Downloads.ToListAsync();
        }

        // GET: api/Downloads/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Download>> GetDownload(int id)
        {
            var download = await _context.Downloads.FindAsync(id);

            if (download == null)
            {
                return NotFound();
            }

            return download;
        }

        // PUT: api/Downloads/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDownload(int id, Download download)
        {
            if (id != download.download_d)
            {
                return BadRequest();
            }

            _context.Entry(download).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DownloadExists(id))
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

        // POST: api/Downloads
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Download>> PostDownload(Download download)
        {
            _context.Downloads.Add(download);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDownload", new { id = download.download_d }, download);
        }

        // DELETE: api/Downloads/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDownload(int id)
        {
            var download = await _context.Downloads.FindAsync(id);
            if (download == null)
            {
                return NotFound();
            }

            _context.Downloads.Remove(download);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DownloadExists(int id)
        {
            return _context.Downloads.Any(e => e.download_d == id);
        }
    }
}

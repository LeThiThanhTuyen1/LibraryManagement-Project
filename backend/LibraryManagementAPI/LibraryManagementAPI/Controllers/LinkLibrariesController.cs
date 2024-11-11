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
    public class LinkLibrariesController : ControllerBase
    {
        private readonly LibraryManagementAPIContext _context;

        public LinkLibrariesController(LibraryManagementAPIContext context)
        {
            _context = context;
        }

        // GET: api/LinkLibraries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LinkLibrary>>> GetLinkLibraries()
        {
            return await _context.LinkLibraries.ToListAsync();
        }

        // GET: api/LinkLibraries/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LinkLibrary>> GetLinkLibrary(int id)
        {
            var linkLibrary = await _context.LinkLibraries.FindAsync(id);

            if (linkLibrary == null)
            {
                return NotFound();
            }

            return linkLibrary;
        }

        // PUT: api/LinkLibraries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLinkLibrary(int id, LinkLibrary linkLibrary)
        {
            if (id != linkLibrary.link_id)
            {
                return BadRequest();
            }

            _context.Entry(linkLibrary).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LinkLibraryExists(id))
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

        // POST: api/LinkLibraries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<LinkLibrary>> PostLinkLibrary(LinkLibrary linkLibrary)
        {
            _context.LinkLibraries.Add(linkLibrary);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLinkLibrary", new { id = linkLibrary.link_id }, linkLibrary);
        }

        // DELETE: api/LinkLibraries/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLinkLibrary(int id)
        {
            var linkLibrary = await _context.LinkLibraries.FindAsync(id);
            if (linkLibrary == null)
            {
                return NotFound();
            }

            _context.LinkLibraries.Remove(linkLibrary);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LinkLibraryExists(int id)
        {
            return _context.LinkLibraries.Any(e => e.link_id == id);
        }
    }
}

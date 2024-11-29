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
    public class LecturersController : ControllerBase
    {
        private readonly LibraryManagementAPIContext _context;

        public LecturersController(LibraryManagementAPIContext context)
        {
            _context = context;
        }

        // GET: api/Lecturers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lecturer>>> GetLecturers()
        {
            return await _context.Lecturers.ToListAsync();
        }

        [HttpGet("WithDetailsByUserId/{userId}")]
        public async Task<IActionResult> GetLecturerWithDetailsByUserId(int userId)
        {
            // Truy xuất thông tin giảng viên dựa trên user_id
            var lecturerWithDetails = await (from lecturer in _context.Lecturers
                                            join user in _context.Users on lecturer.user_id equals user.user_id
                                            join major in _context.Majors on lecturer.major_id equals major.major_id
                                            where lecturer.user_id == userId
                                            select new
                                            {
                                                LecturerId = lecturer.lecturer_id,
                                                UserId = lecturer.user_id,
                                                FirstName = user.first_name,
                                                LastName = user.last_name,
                                                Username = user.username,
                                                Email = user.email,
                                                PhoneNumber = user.phone_number,
                                                MajorName = major.major_name,
                                                Position = lecturer.position,
                                                StartYear = lecturer.start_year
                                            }).FirstOrDefaultAsync();

            if (lecturerWithDetails == null)
            {
                return NotFound(new { message = "Lecturer not found." });
            }
            return Ok(lecturerWithDetails);
        }
        
        // GET: api/Lecturers/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Lecturer>> GetLecturer(int id)
        {
            var lecturer = await _context.Lecturers.FindAsync(id);

            if (lecturer == null)
            {
                return NotFound();
            }

            return lecturer;
        }

        // PUT: api/Lecturers/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLecturer(int id, Lecturer lecturer)
        {
            if (id != lecturer.lecturer_id)
            {
                return BadRequest();
            }

            _context.Entry(lecturer).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LecturerExists(id))
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

        // POST: api/Lecturers
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Lecturer>> PostLecturer(Lecturer lecturer)
        {
            _context.Lecturers.Add(lecturer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLecturer", new { id = lecturer.lecturer_id }, lecturer);
        }

        [HttpPut("UpdateLecturer")]
        public async Task<IActionResult> UpdateLecturer([FromBody] Lecturer lecturerDto)
        {
            if (lecturerDto == null || lecturerDto.lecturer_id == 0)
            {
                return BadRequest(new { message = "Dữ liệu giảng viên không hợp lệ" });
            }

            var lecturer = await _context.Lecturers.FirstOrDefaultAsync(l => l.lecturer_id == lecturerDto.lecturer_id);
            if (lecturer == null)
            {
                return NotFound(new { message = "Không tìm thấy giảng viên" });
            }

            // Cập nhật các thuộc tính cần thiết từ DTO
            lecturer.position = lecturerDto.position;
            lecturer.start_year = lecturerDto.start_year;
            lecturer.major_id = lecturerDto.major_id;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Cập nhật giảng viên thành công" });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, new { message = "Lỗi trong quá trình cập nhật giảng viên", error = ex.Message });
            }
        }

        // DELETE: api/Lecturers/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLecturer(int id)
        {
            var lecturer = await _context.Lecturers.FindAsync(id);
            if (lecturer == null)
            {
                return NotFound();
            }

            _context.Lecturers.Remove(lecturer);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LecturerExists(int id)
        {
            return _context.Lecturers.Any(e => e.lecturer_id == id);
        }
    }
}

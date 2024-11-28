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
    public class StudentsController : ControllerBase
    {
        private readonly LibraryManagementAPIContext _context;

        public StudentsController(LibraryManagementAPIContext context)
        {
            _context = context;
        }
        
        // GET: api/Students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Student>>> GetStudents()
        {
            return await _context.Students.ToListAsync();
        }

        [HttpGet("WithDetails/{id}")]
        public async Task<IActionResult> GetStudentWithDetails(int id)
        {
            var studentWithDetails = await (from student in _context.Students
                                            join user in _context.Users on student.user_id equals user.user_id
                                            join major in _context.Majors on student.major_id equals major.major_id
                                            where student.student_id == id
                                            select new
                                            {
                                                StudentId = student.student_id,
                                                UserId = student.user_id,
                                                FirstName = user.first_name,
                                                LastName = user.last_name,
                                                Username = user.username,
                                                Email = user.email,
                                                PhoneNumber = user.phone_number,
                                                MajorName = major.major_name,
                                                Course = student.course,
                                                EnrollmentYear = student.enrollment_year
                                            }).FirstOrDefaultAsync();

            if (studentWithDetails == null)
            {
                return NotFound(new { message = "Student not found." });
            }

            return Ok(studentWithDetails);
        }
    
        // GET: api/Students/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Student>> GetStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);

            if (student == null)
            {
                return NotFound();
            }

            return student;
        }

        // PUT: api/Students/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, Student student)
        {
            if (id != student.student_id)
            {
                return BadRequest();
            }

            _context.Entry(student).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StudentExists(id))
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

        // POST: api/Students
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Student>> PostStudent(Student student)
        {
            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetStudent", new { id = student.student_id }, student);
        }

        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentExists(int id)
        {
            return _context.Students.Any(e => e.student_id == id);
        }
    }
}

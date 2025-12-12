using hrapp.Models.Account;
using hrapp.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly AppDbContext _context;

    public AttendanceController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{employeeId}")]
    public async Task<IActionResult> GetAttendance(int employeeId)
    {
        var attendances = await _context.Attendances
            .Where(a => a.EmployeeId == employeeId)
            .OrderByDescending(a => a.Date)
            .Select(a => new { a.Date, a.Status })
            .ToListAsync();

        return Ok(attendances);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAttendance([FromBody] CreateAttendanceDto dto)
    {
        if (await _context.Attendances.AnyAsync(a => a.EmployeeId == dto.EmployeeId && a.Date.Date == dto.Date.Date))
            return BadRequest("Attendance already marked for this date");

        var attendance = new Attendance
        {
            EmployeeId = dto.EmployeeId,
            Date = dto.Date.Date,
            Status = dto.Status
        };

        _context.Attendances.Add(attendance);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Attendance marked successfully" });
    }
}

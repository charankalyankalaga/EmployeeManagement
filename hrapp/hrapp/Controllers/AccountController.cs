using hrapp.Models.Account;
using hrapp.Models.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;

    public AccountController(AppDbContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterEmployeeDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (dto.Password != dto.ConfirmPassword)
            return BadRequest("Passwords do not match.");

        var department = await _context.Departments.FindAsync(dto.DepartmentId);
        if (department == null)
            return BadRequest($"Department with id {dto.DepartmentId} does not exist.");

        var employee = new Employee
        {
            FullName = dto.FullName,
            Email = dto.FullName + "@company.com",
            DepartmentId = dto.DepartmentId,
            Password = dto.Password      // store plain password
        };

        _context.Employees.Add(employee);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Employee registered successfully" });
    }


    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var employee = await _context.Employees
            .FirstOrDefaultAsync(e => e.FullName == dto.UserName);

        if (employee == null || employee.Password != dto.Password)
            return Unauthorized("Invalid credentials");

        var token = GenerateJwtToken(employee);

        return Ok(new
        {
            token,
            username = employee.FullName,
            employeeName = employee.FullName
        });
    }


    [HttpGet("dashboard")]
    [Authorize]
    public async Task<IActionResult> Dashboard()
    {
        var employees = await _context.Employees
            .Include(e => e.Department)
            .Select(e => new EmployeeDto
            {
                Id = e.EmployeeId,
                FullName = e.FullName,
                Email = e.Email
            })
            .ToListAsync();

        return Ok(employees);
    }

    private string GenerateJwtToken(Employee employee)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, employee.FullName),
            new Claim(ClaimTypes.NameIdentifier, employee.EmployeeId.ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? ""));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

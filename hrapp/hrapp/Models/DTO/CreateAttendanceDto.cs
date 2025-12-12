namespace hrapp.Models.DTO
{
    public class CreateAttendanceDto
    {
        public int EmployeeId { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }   // Present, Absent, Leave
    }
}

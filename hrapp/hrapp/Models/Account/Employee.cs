namespace hrapp.Models.Account
{
    public class Employee
    {
        public int EmployeeId { get; set; }                 
        public string FullName { get; set; }

        public string Email { get; set; }

        public int DepartmentId { get; set; }

        public Department Department { get; set; }

        public ICollection<Attendance> AttendanceRecords { get; set; }

        public string Password { get; set; }
    }

}

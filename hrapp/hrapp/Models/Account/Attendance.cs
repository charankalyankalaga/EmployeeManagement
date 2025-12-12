namespace hrapp.Models.Account
{
    public class Attendance
    {
        public int EmployeeId { get; set; }
        public DateTime Date { get; set; }
        public string Status { get; set; }

        // Navigation
        public Employee Employee { get; set; }
    }

}

namespace hrapp.Models.DTO
{
    public class RegisterEmployeeDto
    {
        public string FullName { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }

        public int DepartmentId { get; set; }
    }
}

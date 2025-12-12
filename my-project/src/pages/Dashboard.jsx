import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ token }) => {
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ fullName: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchEmployees();
  }, [token]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/account/dashboard');
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/employee', { fullName: newEmployee.fullName });
      setNewEmployee({ fullName: '' });
      fetchEmployees();
    } catch (err) {
      console.error('Error adding employee');
    }
  };

  const deleteEmployee = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await axios.delete(`/employee/${id}`);
        fetchEmployees();
      } catch (err) {
        console.error('Error deleting employee');
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Employee Dashboard</h2>
      
      {/* Add Employee Form */}
      <div className="bg-white shadow-xl rounded-xl p-8 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Add New Employee</h3>
        <form onSubmit={addEmployee} className="flex gap-4">
          <input 
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
            placeholder="Enter full name"
            value={newEmployee.fullName} 
            onChange={(e) => setNewEmployee({...newEmployee, fullName: e.target.value})}
            required 
          />
          <button 
            type="submit" 
            className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            Add Employee
          </button>
        </form>
      </div>

      {/* Employees Table */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Employees ({employees.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map(emp => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{emp.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link 
                      to={`/attendance/${emp.id}`} 
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    >
                      View Attendance
                    </Link>
                    <button 
                      onClick={() => deleteEmployee(emp.id)} 
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

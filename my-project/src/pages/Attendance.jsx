import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Attendance = ({ token }) => {
  const { employeeId } = useParams();
  const [attendance, setAttendance] = useState([]);
  const [newAttendance, setNewAttendance] = useState({ date: '', status: 'Present' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchAttendance();
  }, [employeeId, token]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`/attendance/${employeeId}`);
      setAttendance(response.data);
    } catch (err) {
      console.error('Error fetching attendance');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/attendance', {
        employeeId: parseInt(employeeId),
        date: new Date(newAttendance.date),
        status: newAttendance.status
      });
      setNewAttendance({ date: '', status: 'Present' });
      fetchAttendance();
    } catch (err) {
      console.error('Error marking attendance');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
    </div>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return 'bg-green-100 text-green-800';
      case 'Absent': return 'bg-red-100 text-red-800';
      case 'Leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Attendance for Employee #{employeeId}</h2>
        <Link 
          to="/dashboard" 
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
        >
          ← Back to Dashboard
        </Link>
      </div>
      
      {/* Mark Attendance Form */}
      <div className="bg-white shadow-xl rounded-xl p-8 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Mark New Attendance</h3>
        <form onSubmit={markAttendance} className="flex gap-4 flex-wrap">
          <input 
            type="date" 
            className="flex-1 min-w-[200px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
            value={newAttendance.date} 
            onChange={(e) => setNewAttendance({...newAttendance, date: e.target.value})} 
            required 
          />
          <select 
            className="min-w-[150px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" 
            value={newAttendance.status} 
            onChange={(e) => setNewAttendance({...newAttendance, status: e.target.value})} 
            required
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Leave">Leave</option>
          </select>
          <button 
            type="submit" 
            className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
          >
            Mark Attendance
          </button>
        </form>
      </div>

      {/* Attendance History */}
      <div className="bg-white shadow-xl rounded-xl overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Attendance History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendance.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
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

export default Attendance;

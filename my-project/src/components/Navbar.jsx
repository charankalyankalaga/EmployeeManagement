import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-white">
              Attendance App
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition duration-200"
            >
              Dashboard
            </Link>
            <button 
              onClick={handleLogout}
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

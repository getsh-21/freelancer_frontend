import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const dashboardLink = user?.role === 'client' ? '/client' : user?.role === 'freelancer' ? '/freelancer' : '/admin';

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold text-sky-600">FreelanceHub</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to={dashboardLink} className="text-gray-600 hover:text-sky-600 font-medium">Dashboard</Link>
              <Link to="/messages" className="text-gray-600 hover:text-sky-600 font-medium">Messages</Link>
              <NotificationBell />
              <Link to="/profile" className="text-gray-600 hover:text-sky-600 font-medium">
                {user.profileImage
                  ? <img src={`http://localhost:5000/uploads/${user.profileImage}`} className="w-8 h-8 rounded-full object-cover" alt="profile" />
                  : <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white text-sm font-bold">{user.name?.[0]}</div>
                }
              </Link>
              <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-sky-600 font-medium">Login</Link>
              <Link to="/register" className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 text-sm font-medium">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
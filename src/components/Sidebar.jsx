import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const clientLinks = [
    { to: '/client', label: '🏠 Dashboard' },
    { to: '/client/post-job', label: '➕ Post Job' },
    { to: '/client/jobs', label: '📋 Manage Jobs' },
    { to: '/messages', label: '💬 Messages' },
    { to: '/profile', label: '👤 Profile' },
  ];

  const freelancerLinks = [
    { to: '/freelancer', label: '🏠 Dashboard' },
    { to: '/freelancer/browse', label: '🔍 Browse Jobs' },
    { to: '/freelancer/projects', label: '📁 My Projects' },
    { to: '/messages', label: '💬 Messages' },
    { to: '/profile', label: '👤 Profile' },
  ];

  const adminLinks = [
    { to: '/admin', label: '🏠 Dashboard' },
    { to: '/admin/users', label: '👥 Users' },
    { to: '/admin/jobs', label: '💼 Jobs' },
    { to: '/admin/analytics', label: '📊 Analytics' },
  ];

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';
  const links = user?.role === 'client' ? clientLinks : user?.role === 'freelancer' ? freelancerLinks : adminLinks;

  return (
    <aside className="w-56 bg-white shadow-sm border-r border-gray-100 min-h-screen py-6 flex-shrink-0">
      {user?.role === 'superadmin' && (
        <div className="mx-3 mb-4 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 text-center">
          <p className="text-purple-700 text-xs font-semibold">🔐 Superadmin</p>
        </div>
      )}
      <ul className="space-y-1 px-3">
        {links.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to.split('/').length <= 2}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-sky-50 text-sky-600' : 'text-gray-600 hover:bg-gray-50'}`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
   axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics`)
      .then(({ data }) => setStats(data))
      .catch(() => {});
  }, []);

  if (!stats) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 flex items-center justify-center">
          <p className="text-gray-400">Loading...</p>
        </main>
      </div>
    </div>
  );

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, color: 'bg-sky-500', link: '/admin/users' },
    { label: 'Total Jobs', value: stats.totalJobs, color: 'bg-indigo-500', link: '/admin/jobs' },
    { label: 'Open Jobs', value: stats.openJobs, color: 'bg-green-500', link: '/admin/jobs' },
    { label: 'Completed', value: stats.completedJobs, color: 'bg-blue-500', link: '/admin/jobs' },
    { label: 'In Progress', value: stats.inProgressJobs, color: 'bg-yellow-500', link: '/admin/jobs' },
    { label: 'Proposals', value: stats.totalProposals, color: 'bg-purple-500', link: '/admin/analytics' },
    { label: 'Freelancers', value: stats.totalFreelancers, color: 'bg-pink-500', link: '/admin/users' },
    { label: 'Reviews', value: stats.totalReviews, color: 'bg-orange-500', link: '/admin/analytics' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">

          {user?.role === 'superadmin' && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-5 py-4 mb-6 flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <p className="font-semibold text-purple-800">Superadmin Panel</p>
                <p className="text-purple-600 text-sm">
                  You have full control. Go to{' '}
                  <Link to="/admin/users" className="underline hover:text-purple-800">
                    Users Management
                  </Link>{' '}
                  to promote or revoke admin access.
                </p>
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {user?.role === 'superadmin' ? 'Superadmin Dashboard' : 'Admin Dashboard'}
          </h1>
          <p className="text-gray-500 mb-6">Platform overview and statistics.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map(c => (
              <Link
                to={c.link}
                key={c.label}
                className={`${c.color} text-white rounded-xl p-5 text-center shadow-sm hover:opacity-90 transition-opacity`}
              >
                <p className="text-3xl font-bold">{c.value}</p>
                <p className="text-sm mt-1 opacity-90">{c.label}</p>
              </Link>
            ))}
          </div>

          {stats.totalAdmins !== undefined && (
            <div className="mt-6 bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Admin Overview</h2>
              <div className="flex gap-6 text-sm">
                <div className="bg-purple-50 rounded-lg px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-purple-700">{stats.totalAdmins}</p>
                  <p className="text-purple-500 mt-1">Admins</p>
                </div>
                <div className="bg-sky-50 rounded-lg px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-sky-700">{stats.totalClients}</p>
                  <p className="text-sky-500 mt-1">Clients</p>
                </div>
                <div className="bg-indigo-50 rounded-lg px-4 py-3 text-center">
                  <p className="text-2xl font-bold text-indigo-700">{stats.totalFreelancers}</p>
                  <p className="text-indigo-500 mt-1">Freelancers</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
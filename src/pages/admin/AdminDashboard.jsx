import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/analytics').then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  if (!stats) return <div className="min-h-screen flex flex-col"><Navbar /><div className="flex flex-1"><Sidebar /><main className="flex-1 p-6 flex items-center justify-center"><p className="text-gray-400">Loading...</p></main></div></div>;

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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-500 mb-6">Platform overview and statistics.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map(c => (
              <Link to={c.link} key={c.label} className={`${c.color} text-white rounded-xl p-5 text-center shadow-sm hover:opacity-90 transition-opacity`}>
                <p className="text-3xl font-bold">{c.value}</p>
                <p className="text-sm mt-1 opacity-90">{c.label}</p>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
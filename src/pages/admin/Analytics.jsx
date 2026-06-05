import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Analytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics`).then(({ data }) => setStats(data)).catch(() => {});
  }, []);

  if (!stats) return <div className="min-h-screen flex flex-col"><Navbar /><div className="flex flex-1"><Sidebar /><main className="flex-1 p-6 flex items-center justify-center"><p className="text-gray-400">Loading analytics...</p></main></div></div>;

  const userChart = {
    labels: ['Clients', 'Freelancers'],
    datasets: [{ data: [stats.totalClients, stats.totalFreelancers], backgroundColor: ['#0ea5e9', '#6366f1'], borderWidth: 0 }],
  };

  const jobChart = {
    labels: ['Open', 'In Progress', 'Completed'],
    datasets: [{ data: [stats.openJobs, stats.inProgressJobs, stats.completedJobs], backgroundColor: ['#22c55e', '#f59e0b', '#3b82f6'], borderWidth: 0 }],
  };

  const activityChart = {
    labels: stats.last7Days.map(d => d.date),
    datasets: [{ label: 'Jobs Posted', data: stats.last7Days.map(d => d.jobs), borderColor: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.1)', tension: 0.4, fill: true }],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Platform Analytics</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-4">User Distribution</h3>
              <div className="h-48"><Doughnut data={userChart} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} /></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-4">Job Status</h3>
              <div className="h-48"><Doughnut data={jobChart} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} /></div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col justify-center gap-3">
              {[['Total Users', stats.totalUsers, 'text-sky-600'], ['Total Jobs', stats.totalJobs, 'text-indigo-600'], ['Total Proposals', stats.totalProposals, 'text-purple-600'], ['Total Reviews', stats.totalReviews, 'text-yellow-600']].map(([label, val, color]) => (
                <div key={label} className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className={`font-bold text-xl ${color}`}>{val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">Job Activity (Last 7 Days)</h3>
            <div className="h-64"><Line data={activityChart} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} /></div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
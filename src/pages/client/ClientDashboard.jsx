import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { getMyJobsApi } from '../../api/jobApi';
import { Link } from 'react-router-dom';

const ClientDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => { getMyJobsApi().then(({ data }) => setJobs(data)).catch(() => {}); }, []);

  const stats = [
    { label: 'Total Jobs', value: jobs.length, color: 'bg-sky-500' },
    { label: 'Open', value: jobs.filter(j => j.status === 'open').length, color: 'bg-green-500' },
    { label: 'In Progress', value: jobs.filter(j => j.status === 'in-progress').length, color: 'bg-yellow-500' },
    { label: 'Completed', value: jobs.filter(j => j.status === 'completed').length, color: 'bg-indigo-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.name}! 👋</h1>
          <p className="text-gray-500 mb-6">Here's an overview of your activity.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className={`${s.color} text-white rounded-xl p-5 text-center shadow-sm`}>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm mt-1 opacity-90">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Jobs</h2>
              <Link to="/client/post-job" className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-sky-600">+ Post New Job</Link>
            </div>
            {jobs.slice(0, 5).map(job => (
              <div key={job._id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-800">{job.title}</p>
                  <p className="text-gray-400 text-sm">${job.budget} • {new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${job.status === 'open' ? 'bg-green-100 text-green-600' : job.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>{job.status}</span>
                  <Link to={`/client/jobs/${job._id}/proposals`} className="text-sky-500 text-sm hover:underline">View</Link>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-gray-400 text-center py-4">No jobs posted yet. <Link to="/client/post-job" className="text-sky-500 hover:underline">Post one now!</Link></p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientDashboard;
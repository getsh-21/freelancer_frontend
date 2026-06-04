import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getJobsApi } from '../../api/jobApi';
import axios from 'axios';

const JobsManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try { const { data } = await getJobsApi({}); setJobs(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    await axios.delete(`http://localhost:5000/api/admin/jobs/${id}`);
    setJobs(jobs.filter(j => j._id !== id));
  };

  const statusColors = { open: 'bg-green-100 text-green-700', 'in-progress': 'bg-yellow-100 text-yellow-700', completed: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-700' };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Jobs Management ({jobs.length})</h1>
          {loading ? <p className="text-gray-400">Loading...</p> : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>{['Title', 'Client', 'Budget', 'Status', 'Date', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {jobs.map(job => (
                    <tr key={job._id} className="border-b hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800 max-w-xs truncate">{job.title}</td>
                      <td className="px-5 py-3 text-gray-500">{job.client?.name}</td>
                      <td className="px-5 py-3 text-sky-600 font-semibold">${job.budget}</td>
                      <td className="px-5 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[job.status]}`}>{job.status}</span></td>
                      <td className="px-5 py-3 text-gray-400">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3"><button onClick={() => handleDelete(job._id)} className="text-red-500 hover:underline text-xs">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobsManagement;
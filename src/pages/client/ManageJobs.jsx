import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getMyJobsApi, deleteJobApi, updateJobApi } from '../../api/jobApi';
import { Link } from 'react-router-dom';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = async () => {
    try { const { data } = await getMyJobsApi(); setJobs(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job?')) return;
    await deleteJobApi(id);
    setJobs(jobs.filter(j => j._id !== id));
  };

  const handleComplete = async (id) => {
    await updateJobApi(id, { status: 'completed' });
    fetchJobs();
  };

  if (loading) return <div className="min-h-screen flex flex-col"><Navbar /><div className="flex flex-1"><Sidebar /><main className="flex-1 p-6 flex items-center justify-center"><p className="text-gray-400">Loading...</p></main></div></div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Manage Jobs</h1>
            <Link to="/client/post-job" className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-sky-600">+ Post Job</Link>
          </div>
          {jobs.length === 0
            ? <div className="bg-white rounded-xl p-10 text-center shadow-sm"><p className="text-gray-400">No jobs found. <Link to="/client/post-job" className="text-sky-500 hover:underline">Post your first job!</Link></p></div>
            : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>{['Title', 'Budget', 'Status', 'Deadline', 'Actions'].map(h => <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600">{h}</th>)}</tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job._id} className="border-b hover:bg-gray-50">
                        <td className="px-5 py-3 font-medium text-gray-800">{job.title}</td>
                        <td className="px-5 py-3 text-sky-600 font-semibold">${job.budget}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'open' ? 'bg-green-100 text-green-600' : job.status === 'in-progress' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>{job.status}</span>
                        </td>
                        <td className="px-5 py-3 text-gray-500">{job.deadline ? new Date(job.deadline).toLocaleDateString() : '-'}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-2">
                            <Link to={`/client/jobs/${job._id}/proposals`} className="text-sky-500 hover:underline text-xs">Proposals</Link>
                            {job.status === 'in-progress' && <button onClick={() => handleComplete(job._id)} className="text-green-500 hover:underline text-xs">Complete</button>}
                            <button onClick={() => handleDelete(job._id)} className="text-red-500 hover:underline text-xs">Delete</button>
                          </div>
                        </td>
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

export default ManageJobs;
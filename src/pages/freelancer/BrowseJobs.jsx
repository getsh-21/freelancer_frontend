import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import JobCard from '../../components/JobCard';
import { getJobsApi } from '../../api/jobApi';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { status: 'open' };
      if (search) params.search = search;
      if (minBudget) params.minBudget = minBudget;
      if (maxBudget) params.maxBudget = maxBudget;
      const { data } = await getJobsApi(params);
      setJobs(data);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Browse Jobs</h1>
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-3">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..."
              className="flex-1 min-w-48 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-sky-400" />
            <input type="number" value={minBudget} onChange={e => setMinBudget(e.target.value)} placeholder="Min $"
              className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400" />
            <input type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} placeholder="Max $"
              className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-400" />
            <button onClick={fetchJobs} className="bg-sky-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-sky-600">Search</button>
          </div>
          {loading ? <p className="text-center text-gray-400">Loading jobs...</p>
            : jobs.length === 0 ? <p className="text-center text-gray-400 py-12">No jobs found.</p>
            : <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{jobs.map(job => <JobCard key={job._id} job={job} />)}</div>
          }
        </main>
      </div>
    </div>
  );
};

export default BrowseJobs;
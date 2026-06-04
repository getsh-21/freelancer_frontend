import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { createJobApi } from '../../api/jobApi';

const PostJob = () => {
  const [form, setForm] = useState({ title: '', description: '', budget: '', skillsRequired: '', deadline: '' });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach(f => fd.append('attachments', f));
      await createJobApi(fd);
      navigate('/client/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Post a New Job</h1>
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400" placeholder="e.g. Build a React Dashboard" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400 resize-none" placeholder="Describe the project in detail..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget ($) *</label>
                  <input required type="number" min="1" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400" placeholder="500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills Required (comma separated)</label>
                <input value={form.skillsRequired} onChange={e => setForm({ ...form, skillsRequired: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400" placeholder="React, Node.js, MongoDB" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Attachments (optional)</label>
                <input type="file" multiple onChange={e => setFiles(Array.from(e.target.files))}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none text-sm" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 disabled:opacity-50">
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PostJob;
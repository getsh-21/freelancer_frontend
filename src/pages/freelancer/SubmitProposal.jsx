import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getJobByIdApi } from '../../api/jobApi';
import { submitProposalApi } from '../../api/proposalApi';

const SubmitProposal = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({ proposalText: '', bidAmount: '', deliveryTime: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { getJobByIdApi(jobId).then(({ data }) => setJob(data)).catch(() => {}); }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await submitProposalApi({ ...form, jobId });
      navigate('/freelancer/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit proposal');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          {job && (
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 mb-6 max-w-2xl">
              <h2 className="font-bold text-sky-800 text-lg mb-1">{job.title}</h2>
              <p className="text-sky-700 text-sm mb-2">{job.description}</p>
              <p className="text-sky-600 font-semibold">Budget: ${job.budget}</p>
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit Proposal</h1>
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cover Letter *</label>
                <textarea required value={form.proposalText} onChange={e => setForm({ ...form, proposalText: e.target.value })} rows={6}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400 resize-none"
                  placeholder="Explain why you're a great fit for this project..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid ($) *</label>
                  <input required type="number" min="1" value={form.bidAmount} onChange={e => setForm({ ...form, bidAmount: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400" placeholder="300" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time (days) *</label>
                  <input required type="number" min="1" value={form.deliveryTime} onChange={e => setForm({ ...form, deliveryTime: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400" placeholder="7" />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Proposal'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubmitProposal;
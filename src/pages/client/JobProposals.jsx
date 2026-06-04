import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import ProposalCard from '../../components/ProposalCard';
import { getJobProposalsApi, updateProposalApi } from '../../api/proposalApi';
import { getJobByIdApi } from '../../api/jobApi';
import { createReviewApi } from '../../api/reviewApi';

const JobProposals = () => {
  const { jobId } = useParams();
  const [proposals, setProposals] = useState([]);
  const [job, setJob] = useState(null);
  const [reviewForm, setReviewForm] = useState({ freelancerId: '', rating: 5, comment: '', show: false });

  useEffect(() => {
    getJobProposalsApi(jobId).then(({ data }) => setProposals(data)).catch(() => {});
    getJobByIdApi(jobId).then(({ data }) => setJob(data)).catch(() => {});
  }, [jobId]);

  const handleAccept = async (id) => {
    const { data } = await updateProposalApi(id, { status: 'accepted' });
    setProposals(proposals.map(p => p._id === id ? { ...p, status: 'accepted' } : { ...p, status: p.status === 'pending' ? 'rejected' : p.status }));
  };

  const handleReject = async (id) => {
    await updateProposalApi(id, { status: 'rejected' });
    setProposals(proposals.map(p => p._id === id ? { ...p, status: 'rejected' } : p));
  };

  const handleReview = async (e) => {
    e.preventDefault();
    await createReviewApi({ freelancerId: reviewForm.freelancerId, jobId, rating: reviewForm.rating, comment: reviewForm.comment });
    setReviewForm({ ...reviewForm, show: false });
    alert('Review submitted!');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          {job && (
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{job.title}</h1>
              <p className="text-gray-500 text-sm">${job.budget} • Status: <span className="font-medium text-gray-700">{job.status}</span></p>
            </div>
          )}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Proposals ({proposals.length})</h2>
          {proposals.length === 0
            ? <div className="bg-white rounded-xl p-10 text-center text-gray-400 shadow-sm">No proposals yet.</div>
            : (
              <div className="space-y-4">
                {proposals.map(p => (
                  <div key={p._id}>
                    <ProposalCard proposal={p} showActions={job?.status !== 'completed'} onAccept={handleAccept} onReject={handleReject} />
                    {p.status === 'accepted' && job?.status === 'in-progress' && (
                      <div className="mt-2 flex gap-2">
                        <Link to="/messages" className="bg-sky-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-sky-600">Message Freelancer</Link>
                        <button onClick={() => setReviewForm({ freelancerId: p.freelancer._id, rating: 5, comment: '', show: true })}
                          className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-yellow-600">Leave Review</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          {reviewForm.show && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-bold mb-4">Leave a Review</h3>
                <form onSubmit={handleReview} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select value={reviewForm.rating} onChange={e => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 bg-white">
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                    <textarea required value={reviewForm.comment} onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })} rows={3}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-sky-400" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 font-medium">Submit</button>
                    <button type="button" onClick={() => setReviewForm({ ...reviewForm, show: false })} className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg hover:bg-gray-200">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default JobProposals;
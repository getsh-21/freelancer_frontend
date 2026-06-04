import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { getMyProposalsApi } from '../../api/proposalApi';

const MyProjects = () => {
  const [proposals, setProposals] = useState([]);

  useEffect(() => { getMyProposalsApi().then(({ data }) => setProposals(data)).catch(() => {}); }, []);

  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', accepted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Projects & Proposals</h1>
          {proposals.length === 0
            ? <div className="bg-white rounded-xl p-12 text-center text-gray-400 shadow-sm">No proposals yet.</div>
            : (
              <div className="space-y-4">
                {proposals.map(p => (
                  <div key={p._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800 text-lg">{p.job?.title}</h3>
                        <p className="text-gray-400 text-sm">Job Budget: <span className="font-medium text-gray-600">${p.job?.budget}</span></p>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[p.status]}`}>{p.status}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{p.proposalText}</p>
                    <div className="flex gap-6 text-sm text-gray-500">
                      <span>💰 My Bid: <strong className="text-gray-800">${p.bidAmount}</strong></span>
                      <span>⏱ Delivery: <strong className="text-gray-800">{p.deliveryTime} days</strong></span>
                      <span>📅 Applied: <strong className="text-gray-800">{new Date(p.createdAt).toLocaleDateString()}</strong></span>
                    </div>
                    {p.status === 'accepted' && (
                      <div className="mt-3 bg-green-50 rounded-lg p-3 text-green-700 text-sm font-medium">
                        🎉 Congratulations! Your proposal was accepted. Go to Messages to coordinate with the client.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default MyProjects;
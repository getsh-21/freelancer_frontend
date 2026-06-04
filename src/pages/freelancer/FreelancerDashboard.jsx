import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { getMyProposalsApi } from '../../api/proposalApi';
import { Link } from 'react-router-dom';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const [proposals, setProposals] = useState([]);

  useEffect(() => { getMyProposalsApi().then(({ data }) => setProposals(data)).catch(() => {}); }, []);

  const stats = [
    { label: 'Total Proposals', value: proposals.length, color: 'bg-sky-500' },
    { label: 'Pending', value: proposals.filter(p => p.status === 'pending').length, color: 'bg-yellow-500' },
    { label: 'Accepted', value: proposals.filter(p => p.status === 'accepted').length, color: 'bg-green-500' },
    { label: 'Rejected', value: proposals.filter(p => p.status === 'rejected').length, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.name}! 👋</h1>
          <p className="text-gray-500 mb-6">Track your proposals and projects.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className={`${s.color} text-white rounded-xl p-5 text-center shadow-sm`}>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm mt-1 opacity-90">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">My Profile</h2>
                <Link to="/profile" className="text-sky-500 text-sm hover:underline">Edit</Link>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xl">{user?.name?.[0]}</div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-yellow-500">{'★'.repeat(Math.round(user?.rating || 0))} <span className="text-gray-400 text-sm">({user?.rating || 0})</span></p>
                </div>
              </div>
              {user?.bio && <p className="text-gray-500 text-sm mb-3">{user.bio}</p>}
              <div className="flex flex-wrap gap-1">
                {user?.skills?.map(s => <span key={s} className="bg-sky-50 text-sky-600 text-xs px-2 py-0.5 rounded-full">{s}</span>)}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Proposals</h2>
              {proposals.slice(0, 4).map(p => (
                <div key={p._id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{p.job?.title}</p>
                    <p className="text-xs text-gray-400">${p.bidAmount} • {p.deliveryTime} days</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${p.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : p.status === 'accepted' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>{p.status}</span>
                </div>
              ))}
              {proposals.length === 0 && <p className="text-gray-400 text-sm text-center py-4"><Link to="/freelancer/browse" className="text-sky-500 hover:underline">Browse jobs</Link> to start applying!</p>}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
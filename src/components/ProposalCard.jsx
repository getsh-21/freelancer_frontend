import React from 'react';

const ProposalCard = ({ proposal, onAccept, onReject, showActions }) => {
  const statusColors = { pending: 'bg-yellow-100 text-yellow-700', accepted: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">
            {proposal.freelancer?.name?.[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{proposal.freelancer?.name}</p>
            <p className="text-yellow-500 text-sm">{'★'.repeat(Math.round(proposal.freelancer?.rating || 0))}{'☆'.repeat(5 - Math.round(proposal.freelancer?.rating || 0))} ({proposal.freelancer?.reviewsCount || 0})</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[proposal.status]}`}>{proposal.status}</span>
      </div>
      <p className="text-gray-600 text-sm mb-3">{proposal.proposalText}</p>
      <div className="flex gap-4 text-sm text-gray-500 mb-3">
        <span>💰 Bid: <strong className="text-gray-800">${proposal.bidAmount}</strong></span>
        <span>⏱ Delivery: <strong className="text-gray-800">{proposal.deliveryTime} days</strong></span>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {proposal.freelancer?.skills?.map(s => <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{s}</span>)}
      </div>
      {showActions && proposal.status === 'pending' && (
        <div className="flex gap-2">
          <button onClick={() => onAccept(proposal._id)} className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-600">Accept</button>
          <button onClick={() => onReject(proposal._id)} className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600">Reject</button>
        </div>
      )}
    </div>
  );
};

export default ProposalCard;
import React from 'react';

const ReviewCard = ({ review }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">{review.client?.name?.[0]}</div>
      <div>
        <p className="font-semibold text-gray-800 text-sm">{review.client?.name}</p>
        <p className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
      </div>
      <span className="ml-auto text-gray-400 text-xs">{new Date(review.createdAt).toLocaleDateString()}</span>
    </div>
    <p className="text-gray-600 text-sm">{review.comment}</p>
    {review.job && <p className="text-gray-400 text-xs mt-2">Project: {review.job.title}</p>}
  </div>
);

export default ReviewCard;
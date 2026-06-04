import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ job }) => {
  const { user } = useAuth();
  const statusColors = { open: 'bg-green-100 text-green-700', 'in-progress': 'bg-yellow-100 text-yellow-700', completed: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-700' };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-800 text-lg">{job.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[job.status]}`}>{job.status}</span>
      </div>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{job.description}</p>
      <div className="flex flex-wrap gap-1 mb-4">
        {job.skillsRequired?.map(skill => (
          <span key={skill} className="bg-sky-50 text-sky-600 text-xs px-2 py-0.5 rounded-full">{skill}</span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sky-600 font-bold text-lg">${job.budget}</span>
          {job.deadline && <span className="text-gray-400 text-xs ml-2">Due: {new Date(job.deadline).toLocaleDateString()}</span>}
        </div>
        {user?.role === 'freelancer' && job.status === 'open' && (
          <Link to={`/freelancer/jobs/${job._id}/apply`} className="bg-sky-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-sky-600">Apply</Link>
        )}
        {user?.role === 'client' && (
          <Link to={`/client/jobs/${job._id}/proposals`} className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-600">View Proposals</Link>
        )}
      </div>
      <p className="text-gray-400 text-xs mt-2">Posted by {job.client?.name} • {new Date(job.createdAt).toLocaleDateString()}</p>
    </div>
  );
};

export default JobCard;
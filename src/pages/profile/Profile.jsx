import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { getFreelancerReviewsApi } from '../../api/reviewApi';
import ReviewCard from '../../components/ReviewCard';
import axios from 'axios';

const Profile = () => {
  const { user, login } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '', skills: user?.skills?.join(', ') || '' });
  const [image, setImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'freelancer') {
      getFreelancerReviewsApi(user._id).then(({ data }) => setReviews(data)).catch(() => {});
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMessage('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('bio', form.bio);
      fd.append('skills', form.skills);
      if (image) fd.append('profileImage', image);
      const { data } = await axios.put('http://localhost:5000/api/users/profile/update', fd);
      login({ ...user, ...data });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Update failed: ' + (err.response?.data?.message || err.message));
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h2>
              {message && <div className={`px-4 py-3 rounded-lg mb-4 text-sm ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{message}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-2xl overflow-hidden">
                    {user?.profileImage ? <img src={`http://localhost:5000/uploads/${user.profileImage}`} className="w-full h-full object-cover" alt="profile" /> : user?.name?.[0]}
                  </div>
                  <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} className="text-sm text-gray-500" />
                </div>
                {[['name', 'Full Name', 'text'], ['bio', 'Bio', 'text']].map(([key, label, type]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    {key === 'bio'
                      ? <textarea value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} rows={3}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400 resize-none" />
                      : <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400" />
                    }
                  </div>
                ))}
                {user?.role === 'freelancer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                    <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400" />
                  </div>
                )}
                <button type="submit" disabled={loading} className="w-full bg-sky-500 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-600 disabled:opacity-50">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
            <div>
              <div className="bg-white rounded-xl shadow-sm p-6 mb-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Account Info</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-800">{user?.email}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="capitalize text-gray-800">{user?.role}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Rating</span><span className="text-yellow-500">{'★'.repeat(Math.round(user?.rating || 0))} ({user?.rating || 0})</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Reviews</span><span className="text-gray-800">{user?.reviewsCount || 0}</span></div>
                </div>
              </div>
              {user?.role === 'freelancer' && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">My Reviews ({reviews.length})</h2>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {reviews.length === 0
                      ? <p className="text-gray-400 text-sm text-center py-4">No reviews yet.</p>
                      : reviews.map(r => <ReviewCard key={r._id} review={r} />)
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'freelancer', skills: '', bio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await registerApi(form);
      login(data);
      navigate(`/${data.role}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Create Account</h2>
        <p className="text-gray-500 text-center mb-8">Join FreelanceHub today</p>
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[['name', 'Full Name', 'text', 'John Doe'], ['email', 'Email', 'email', 'you@example.com'], ['password', 'Password', 'password', '••••••••']].map(([key, label, type, ph]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} required value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400" placeholder={ph} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            {/* Admin removed — only client and freelancer can self-register */}
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400 bg-white">
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
          </div>
          {form.role === 'freelancer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
              <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400" placeholder="React, Node.js, MongoDB" />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio (optional)</label>
            <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={2}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400 resize-none" placeholder="Tell us about yourself..." />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 disabled:opacity-50 transition-colors">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">Already have an account? <Link to="/login" className="text-sky-500 hover:underline font-medium">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
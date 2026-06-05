import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';

const getDashboardPath = (role) => {
  if (role === 'client') return '/client';
  if (role === 'freelancer') return '/freelancer';
  if (role === 'admin' || role === 'superadmin') return '/admin';
  return '/';
};

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await loginApi(form);
      login(data);
      navigate(getDashboardPath(data.role));
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-8">Sign in to your FreelanceHub account</p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-500 hover:underline font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const UsersManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`);
      // Hide superadmin from the list for everyone
      setUsers(data.filter(u => u.role !== 'superadmin'));
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
      setActionMsg('User deleted.');
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Delete failed.');
    }
  };

  const handlePromote = async (id) => {
    if (!window.confirm('Promote this user to admin?')) return;
    try {
      const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/promote`);
      setActionMsg(data.message);
      fetchUsers();
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Promote failed.');
    }
  };

  const handleRevoke = async (id) => {
    if (!window.confirm('Revoke admin access? User will become a freelancer.')) return;
    try {
      const { data } = await aaxios.put(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}/revoke`);
      setActionMsg(data.message);
      fetchUsers();
    } catch (err) {
      setActionMsg(err.response?.data?.message || 'Revoke failed.');
    }
  };

  const roleColors = {
    client: 'bg-sky-100 text-sky-700',
    freelancer: 'bg-indigo-100 text-indigo-700',
    admin: 'bg-purple-100 text-purple-700',
  };

  const isSuperAdmin = currentUser?.role === 'superadmin';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">User Management ({users.length})</h1>

          {isSuperAdmin && (
            <div className="bg-purple-50 border border-purple-200 rounded-xl px-4 py-3 mb-4 text-purple-700 text-sm font-medium">
              🔐 You are logged in as <strong>Superadmin</strong>. You can promote or revoke admin access.
            </div>
          )}

          {actionMsg && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 mb-4 text-green-700 text-sm">
              {actionMsg}
              <button onClick={() => setActionMsg('')} className="ml-3 text-green-500 hover:underline text-xs">dismiss</button>
            </div>
          )}

          {loading ? <p className="text-gray-400">Loading...</p> : (
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {['Name', 'Email', 'Role', 'Rating', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{u.name}</td>
                      <td className="px-5 py-3 text-gray-500">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[u.role] || 'bg-gray-100 text-gray-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-yellow-500">
                        {'★'.repeat(Math.round(u.rating || 0))}
                        <span className="text-gray-400"> ({u.rating || 0})</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-3 flex-wrap">
                          {isSuperAdmin && u.role !== 'admin' && (
                            <button onClick={() => handlePromote(u._id)}
                              className="text-purple-600 hover:underline text-xs font-medium">
                              Make Admin
                            </button>
                          )}
                          {isSuperAdmin && u.role === 'admin' && (
                            <button onClick={() => handleRevoke(u._id)}
                              className="text-orange-500 hover:underline text-xs font-medium">
                              Revoke Admin
                            </button>
                          )}
                          {(isSuperAdmin || u.role !== 'admin') && (
                            <button onClick={() => handleDelete(u._id)}
                              className="text-red-500 hover:underline text-xs">
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UsersManagement;
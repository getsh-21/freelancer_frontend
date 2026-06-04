import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const UsersManagement = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try { const { data } = await axios.get('http://localhost:5000/api/users'); setUsers(data); }
    catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
      setUsers(users.filter(u => u._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handlePromote = async (id) => {
    if (!window.confirm('Promote this user to admin?')) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/promote`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Promote failed');
    }
  };

  const handleDemote = async (id) => {
    if (!window.confirm('Demote this admin to freelancer?')) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/demote`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Demote failed');
    }
  };

  const roleColors = { client: 'bg-sky-100 text-sky-700', freelancer: 'bg-indigo-100 text-indigo-700', admin: 'bg-purple-100 text-purple-700' };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">User Management ({users.length})</h1>
          {loading ? <p className="text-gray-400">Loading...</p> : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>{['Name', 'Email', 'Role', 'Rating', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-semibold text-gray-600">{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} className="border-b hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">
                        {u.name}
                        {u.isSuperAdmin && <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">Super Admin</span>}
                      </td>
                      <td className="px-5 py-3 text-gray-500">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[u.role]}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3 text-yellow-500">
                        {'★'.repeat(Math.round(u.rating || 0))} <span className="text-gray-400">({u.rating || 0})</span>
                      </td>
                      <td className="px-5 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2 flex-wrap">
                          {/* Super admin sees promote/demote buttons */}
                          {user?.isSuperAdmin && !u.isSuperAdmin && u.role !== 'admin' && (
                            <button onClick={() => handlePromote(u._id)} className="text-purple-500 hover:underline text-xs">Promote</button>
                          )}
                          {user?.isSuperAdmin && !u.isSuperAdmin && u.role === 'admin' && (
                            <button onClick={() => handleDemote(u._id)} className="text-orange-500 hover:underline text-xs">Demote</button>
                          )}
                          {!u.isSuperAdmin && (
                            <button onClick={() => handleDelete(u._id)} className="text-red-500 hover:underline text-xs">Delete</button>
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
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ClientDashboard from '../pages/client/ClientDashboard';
import PostJob from '../pages/client/PostJob';
import ManageJobs from '../pages/client/ManageJobs';
import JobProposals from '../pages/client/JobProposals';
import FreelancerDashboard from '../pages/freelancer/FreelancerDashboard';
import BrowseJobs from '../pages/freelancer/BrowseJobs';
import SubmitProposal from '../pages/freelancer/SubmitProposal';
import MyProjects from '../pages/freelancer/MyProjects';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UsersManagement from '../pages/admin/UsersManagement';
import JobsManagement from '../pages/admin/JobsManagement';
import Analytics from '../pages/admin/Analytics';
import ChatPage from '../pages/messages/ChatPage';
import Profile from '../pages/profile/Profile';

const getDashboardPath = (role) => {
  if (role === 'client') return '/client';
  if (role === 'freelancer') return '/freelancer';
  if (role === 'admin' || role === 'superadmin') return '/admin';
  return '/';
};

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles) {
    const allowed = roles.includes(user.role) ||
      (roles.includes('admin') && user.role === 'superadmin');
    if (!allowed) return <Navigate to={getDashboardPath(user.role)} replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { user } = useAuth();
  const dashboardPath = user ? getDashboardPath(user.role) : '/';

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/login"
        element={!user ? <Login /> : <Navigate to={dashboardPath} replace />}
      />
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to={dashboardPath} replace />}
      />

      {/* Redirect /superadmin to /admin */}
      <Route path="/superadmin" element={<Navigate to="/admin" replace />} />
      <Route path="/superadmin/*" element={<Navigate to="/admin" replace />} />

      {/* Client routes */}
      <Route path="/client" element={
        <ProtectedRoute roles={['client']}><ClientDashboard /></ProtectedRoute>
      } />
      <Route path="/client/post-job" element={
        <ProtectedRoute roles={['client']}><PostJob /></ProtectedRoute>
      } />
      <Route path="/client/jobs" element={
        <ProtectedRoute roles={['client']}><ManageJobs /></ProtectedRoute>
      } />
      <Route path="/client/jobs/:jobId/proposals" element={
        <ProtectedRoute roles={['client']}><JobProposals /></ProtectedRoute>
      } />

      {/* Freelancer routes */}
      <Route path="/freelancer" element={
        <ProtectedRoute roles={['freelancer']}><FreelancerDashboard /></ProtectedRoute>
      } />
      <Route path="/freelancer/browse" element={
        <ProtectedRoute roles={['freelancer']}><BrowseJobs /></ProtectedRoute>
      } />
      <Route path="/freelancer/jobs/:jobId/apply" element={
        <ProtectedRoute roles={['freelancer']}><SubmitProposal /></ProtectedRoute>
      } />
      <Route path="/freelancer/projects" element={
        <ProtectedRoute roles={['freelancer']}><MyProjects /></ProtectedRoute>
      } />

      {/* Admin + Superadmin routes */}
      <Route path="/admin" element={
        <ProtectedRoute roles={['admin', 'superadmin']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute roles={['admin', 'superadmin']}><UsersManagement /></ProtectedRoute>
      } />
      <Route path="/admin/jobs" element={
        <ProtectedRoute roles={['admin', 'superadmin']}><JobsManagement /></ProtectedRoute>
      } />
      <Route path="/admin/analytics" element={
        <ProtectedRoute roles={['admin', 'superadmin']}><Analytics /></ProtectedRoute>
      } />

      {/* Shared routes */}
      <Route path="/messages" element={
        <ProtectedRoute><ChatPage /></ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute><Profile /></ProtectedRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to={dashboardPath} replace />} />
    </Routes>
  );
};

export default AppRoutes;
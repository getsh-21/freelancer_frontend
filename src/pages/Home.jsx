import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-sky-600 to-indigo-600 text-white py-24 px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Find the Perfect Freelancer</h1>
          <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">Connect with top talent. Post jobs, submit proposals, and build great things together.</p>
          {!user ? (
            <div className="flex gap-4 justify-center">
              <Link to="/register" className="bg-white text-sky-600 px-8 py-3 rounded-xl font-semibold hover:bg-sky-50 transition-colors">Get Started</Link>
              <Link to="/login" className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">Login</Link>
            </div>
          ) : (
            <Link to={`/${user.role}`} className="bg-white text-sky-600 px-8 py-3 rounded-xl font-semibold hover:bg-sky-50">Go to Dashboard</Link>
          )}
        </section>
        <section className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🚀', title: 'Post Jobs', desc: 'Clients post jobs and find the best freelancers quickly.' },
            { icon: '💼', title: 'Submit Proposals', desc: 'Freelancers browse and apply to jobs that match their skills.' },
            { icon: '⭐', title: 'Build Reputation', desc: 'Reviews and ratings help great work get recognized.' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow">
              <div className="text-5xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
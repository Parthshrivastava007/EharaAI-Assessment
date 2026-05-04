import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User as UserIcon, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member'
  });
  const { signup, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-5 bg-[radial-gradient(circle_at_top_left,_#1e1b4b,_#0f172a)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] p-10 text-center glass"
      >
        <div className="mb-8">
          <UserPlus size={40} className="mx-auto text-indigo-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-slate-400">Join the team task manager</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          <div className="relative">
            <UserIcon size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Full Name"
              className="pl-12 input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="email"
              placeholder="Email Address"
              className="pl-12 input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="password"
              placeholder="Password"
              className="pl-12 input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="relative">
            <Shield size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <select
              className="pl-12 input-field appearance-none"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              required
            >
              <option value="Member" className="bg-slate-900">Member</option>
              <option value="Admin" className="bg-slate-900">Admin</option>
            </select>
          </div>

          {error && <div className="text-red-400 bg-red-400/10 p-3 rounded-lg text-sm text-center">{error}</div>}

          <button type="submit" className="w-full btn-primary">
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-slate-400">
          <p>Already have an account? <Link to="/login" className="text-indigo-500 font-semibold hover:underline">Login</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

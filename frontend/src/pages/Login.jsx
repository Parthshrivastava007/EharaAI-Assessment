import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
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
          <LogIn size={40} className="mx-auto text-indigo-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-400">Login to manage your team tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
          <div className="relative">
            <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="email"
              placeholder="Email Address"
              className="pl-12 input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="password"
              placeholder="Password"
              className="pl-12 input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="text-red-400 bg-red-400/10 p-3 rounded-lg text-sm text-center">{error}</div>}

          <button type="submit" className="w-full btn-primary">
            Login
          </button>
        </form>

        <div className="mt-6 text-slate-400">
          <p>Don't have an account? <Link to="/signup" className="text-indigo-500 font-semibold hover:underline">Signup</Link></p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Briefcase, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, delay }) => {
  const colorMap = {
    blue: "bg-indigo-500/15 text-indigo-500",
    orange: "bg-amber-500/15 text-amber-500",
    green: "bg-emerald-500/15 text-emerald-500",
    red: "bg-rose-500/15 text-rose-500",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-6 glass flex items-center gap-5"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-3xl font-bold mb-1">{value}</h3>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{title}</p>
      </div>
    </motion.div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh] text-slate-400 text-lg">
      <div className="animate-pulse">Loading dashboard...</div>
    </div>
  );

  const totalTasks = stats?.taskCount || 0;
  const statusColors = {
    'To Do': 'bg-indigo-500',
    'In Progress': 'bg-amber-500',
    'Completed': 'bg-emerald-500'
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">Dashboard</h1>
        <p className="text-slate-400 text-lg">Track your project progress and team performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Projects" value={stats?.projectCount} icon={Briefcase} color="blue" delay={0.1} />
        <StatCard title="Active Tasks" value={stats?.pendingTasks} icon={Clock} color="orange" delay={0.2} />
        <StatCard title="Completed" value={stats?.completedTasks} icon={CheckCircle} color="green" delay={0.3} />
        <StatCard title="Overdue" value={stats?.overdueTasks} icon={AlertCircle} color="red" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-8 glass"
        >
          <h3 className="text-xl font-bold mb-8">Task Status Distribution</h3>
          <div className="flex flex-col gap-6">
            {stats?.statusStats.map((s, idx) => {
              const percentage = totalTasks > 0 ? (s.count / totalTasks) * 100 : 0;
              return (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{s._id}</span>
                    <span className="text-slate-400">{s.count} ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: 0.8 + (idx * 0.1) }}
                      className={`h-full rounded-full ${statusColors[s._id] || 'bg-slate-500'}`}
                    />
                  </div>
                </div>
              );
            })}
            {(!stats?.statusStats || stats.statusStats.length === 0) && (
              <p className="text-slate-400 text-center py-10">No tasks data available</p>
            )}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="p-8 glass"
        >
          <h3 className="text-xl font-bold mb-6">Welcome to TaskFlow</h3>
          <p className="text-slate-400 mb-8 leading-relaxed">
            This is your central hub for managing projects and tracking tasks. 
            Use the sidebar to navigate between your projects and assigned tasks.
          </p>
          <div className="flex flex-col gap-4">
            {[
              { text: "Create new projects and invite members", color: "text-emerald-500" },
              { text: "Assign tasks with deadlines", color: "text-indigo-500" },
              { text: "Monitor real-time progress", color: "text-amber-500" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle size={18} className={item.color} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

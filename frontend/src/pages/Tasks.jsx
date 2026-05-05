import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, CheckSquare, Clock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const TaskModal = ({ isOpen, onClose, onSave, projects, users }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignedTo: '',
    priority: 'Medium',
    dueDate: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex justify-center items-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg p-8 glass"
      >
        <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-400">Task Title</label>
            <input
              type="text"
              className="input-field"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-400">Project</label>
            <select
              className="input-field appearance-none"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              required
            >
              <option value="" className="bg-slate-900">Select Project</option>
              {projects.map(p => (
                <option key={p._id} value={p._id} className="bg-slate-900">{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-400">Assign To</label>
            <select
              className="input-field appearance-none"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              required
            >
              <option value="" className="bg-slate-900">Select User</option>
              {users.map(u => (
                <option key={u._id} value={u._id} className="bg-slate-900">{u.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-400">Priority</label>
              <select
                className="input-field appearance-none"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="Low" className="bg-slate-900 text-blue-400">Low</option>
                <option value="Medium" className="bg-slate-900 text-amber-400">Medium</option>
                <option value="High" className="bg-slate-900 text-rose-400">High</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-400">Due Date</label>
              <input
                type="date"
                className="input-field"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Task</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes, usersRes] = await Promise.all([
        api.get('/tasks/my'),
        api.get('/projects'),
        api.get('/users')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateTask = async (data) => {
    try {
      await api.post('/tasks', data);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getPriorityColor = (p) => {
    if (p === 'High') return 'text-rose-400';
    if (p === 'Medium') return 'text-amber-400';
    return 'text-indigo-400';
  };

  const getStatusClass = (status) => clsx(
    "px-4 py-1.5 rounded-full text-xs font-bold border outline-none appearance-none transition-all",
    status === 'To Do' && "bg-white/5 border-white/10 text-slate-400",
    status === 'In Progress' && "bg-amber-500/10 border-amber-500/20 text-amber-500",
    status === 'Completed' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
  );

  if (loading) return <div className="flex justify-center items-center h-[80vh] text-slate-400 animate-pulse">Loading tasks...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            {user?.role === 'Admin' ? 'Team Tasks' : 'My Tasks'}
          </h1>
          <p className="text-slate-400 text-lg">
            {user?.role === 'Admin' ? 'Track progress across all projects' : 'Stay on top of your responsibilities'}
          </p>
        </div>
        {user?.role === 'Admin' && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            <span>New Task</span>
          </button>
        )}
      </div>

      <div className="glass overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 text-[10px] uppercase tracking-[2px] font-bold">
              <th className="px-8 py-5">Task</th>
              <th className="px-6 py-5">Project</th>
              {user?.role === 'Admin' && <th className="px-6 py-5">Assigned To</th>}
              <th className="px-6 py-5">Priority</th>
              <th className="px-6 py-5">Due Date</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-8 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {tasks.map((task, index) => (
                <motion.tr
                  key={task._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-8 py-6 font-semibold">{task.title}</td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] text-slate-400">
                      {task.project?.name || 'Unassigned'}
                    </span>
                  </td>
                  {user?.role === 'Admin' && (
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{task.assignedTo?.name || 'Unassigned'}</span>
                        <span className="text-[10px] text-slate-500">{task.assignedTo?.email}</span>
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-6">
                    <span className={clsx("text-sm font-bold", getPriorityColor(task.priority))}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <select 
                      value={task.status} 
                      onChange={(e) => updateStatus(task._id, e.target.value)}
                      className={getStatusClass(task.status)}
                    >
                      <option value="To Do" className="bg-slate-900">To Do</option>
                      <option value="In Progress" className="bg-slate-900">In Progress</option>
                      <option value="Completed" className="bg-slate-900">Completed</option>
                    </select>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {user?.role === 'Admin' && (
                      <button 
                        onClick={() => handleDelete(task._id)} 
                        className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {tasks.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            <CheckSquare size={48} className="mx-auto mb-4 opacity-10" />
            <p>{user?.role === 'Admin' ? 'No tasks created yet' : 'No tasks assigned to you'}</p>
          </div>
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTask}
        projects={projects}
        users={users}
      />
    </div>
  );
};

export default Tasks;

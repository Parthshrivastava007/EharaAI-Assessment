import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Briefcase, Users, Calendar, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectModal = ({ isOpen, onClose, onSave, users, project = null }) => {
  const [formData, setFormData] = useState({
    name: project?.name || '',
    description: project?.description || '',
    members: project?.members?.map(m => m._id) || []
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
        <h2 className="text-2xl font-bold mb-6">{project ? 'Edit Project' : 'Create Project'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-400">Project Name</label>
            <input
              type="text"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-400">Description</label>
            <textarea
              rows="3"
              className="input-field"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-400">Team Members</label>
            <select
              multiple
              className="input-field h-32"
              value={formData.members}
              onChange={(e) => setFormData({
                ...formData,
                members: Array.from(e.target.selectedOptions, option => option.value)
              })}
            >
              {users.map(user => (
                <option key={user._id} value={user._id} className="p-2 bg-slate-900 mb-1 rounded">
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500 italic">Hold Ctrl to select multiple members</p>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Project</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [projectsRes, usersRes] = await Promise.all([
        api.get('/projects'),
        api.get('/users')
      ]);
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

  const handleCreateProject = async (data) => {
    try {
      await api.post('/projects', data);
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-[80vh] text-slate-400 text-lg animate-pulse">
      Loading projects...
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Projects</h1>
          <p className="text-slate-400 text-lg">Manage your teams and workspaces</p>
        </div>
        {user?.role === 'Admin' && (
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.1 }}
              className="p-8 glass flex flex-col h-full group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
                  <Briefcase size={24} />
                </div>
                {user?.role === 'Admin' && (
                  <button 
                    onClick={() => handleDelete(project._id)} 
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">{project.name}</h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">{project.description}</p>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Users size={14} />
                  <span>{project.members.length + 1} members</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar size={14} />
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center -space-x-3">
                <div 
                  className="w-9 h-9 rounded-full bg-indigo-600 border-2 border-slate-900 flex items-center justify-center text-xs font-bold ring-2 ring-transparent group-hover:ring-indigo-500/50 transition-all"
                  title={`Owner: ${project.owner.name}`}
                >
                  {project.owner.name.charAt(0)}
                </div>
                {project.members.slice(0, 3).map(m => (
                  <div 
                    key={m._id} 
                    className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-400"
                    title={m.name}
                  >
                    {m.name.charAt(0)}
                  </div>
                ))}
                {project.members.length > 3 && (
                  <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-500">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {projects.length === 0 && (
        <div className="text-center py-24 text-slate-500">
          <Briefcase size={64} className="mx-auto mb-6 opacity-10" />
          <h3 className="text-xl font-semibold mb-2">No projects found</h3>
          <p>Start by creating a new project to collaborate with your team.</p>
        </div>
      )}

      <ProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleCreateProject}
        users={users}
      />
    </div>
  );
};

export default Projects;

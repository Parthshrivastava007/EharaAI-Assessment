import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';

const Sidebar = () => {
  const { logout, user } = useAuth();

  const navLinkClass = ({ isActive }) => clsx(
    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
    isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:bg-white/5 hover:text-white"
  );

  return (
    <aside className="w-[280px] h-screen hidden md:flex flex-col p-6 fixed left-0 top-0 glass rounded-none border-y-0 border-l-0 z-50">
      <div className="mb-10 px-2">
        <div className="flex items-center gap-3 text-2xl font-bold text-white">
          <CheckSquare className="text-indigo-500" />
          <span>TaskFlow</span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        <NavLink to="/" end className={navLinkClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={navLinkClass}>
          <Briefcase size={20} />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/tasks" className={navLinkClass}>
          <CheckSquare size={20} />
          <span>My Tasks</span>
        </NavLink>
      </nav>

      <div className="pt-6 border-t border-white/10 mt-auto">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-white">{user?.name}</span>
            <span className="text-xs text-slate-400">{user?.role}</span>
          </div>
        </div>
        <button 
          onClick={logout} 
          className="flex items-center gap-3 w-full px-4 py-3 text-red-400 font-semibold rounded-xl transition-all hover:bg-red-400/10 active:scale-95"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

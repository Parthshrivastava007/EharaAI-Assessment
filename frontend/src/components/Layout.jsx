import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />
      <main className="flex-1 md:ml-[280px] p-6 md:p-10 min-h-screen bg-[radial-gradient(circle_at_top_right,_#1e1b4b,_#0f172a)]">
        {children}
      </main>
    </div>
  );
};

export default Layout;

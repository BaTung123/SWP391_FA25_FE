import React from 'react';
import { Outlet } from 'react-router-dom';

const SidebarLayout = () => {
  return (
    <div className="sidebar-layout">
      <aside className="sidebar">
        <nav>
          <h2>Information</h2>
          <ul>
            <li><a href="/information">Dashboard</a></li>
            <li><a href="/information/reports">Reports</a></li>
            <li><a href="/information/settings">Settings</a></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;

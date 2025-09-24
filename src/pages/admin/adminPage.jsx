import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <nav>
          <a href="/admin">Dashboard</a>
          <a href="/admin/user">User Management</a>
        </nav>
      </header>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPage;

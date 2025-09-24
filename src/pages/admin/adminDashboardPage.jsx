import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>150</p>
        </div>
        <div className="stat-card">
          <h3>Active Users</h3>
          <p>120</p>
        </div>
        <div className="stat-card">
          <h3>New Users Today</h3>
          <p>5</p>
        </div>
      </div>
      <div className="dashboard-content">
        <h2>Recent Activity</h2>
        <ul>
          <li>User John Doe registered</li>
          <li>User Jane Smith updated profile</li>
          <li>User Bob Wilson logged in</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

import React from 'react';
import { Outlet } from 'react-router-dom';

const MemberPage = () => {
  return (
    <div className="member-page">
      <header className="member-header">
        <h1>Member Area</h1>
        <nav>
          <a href="/member/profile">Profile</a>
          <a href="/member/dashboard">Dashboard</a>
        </nav>
      </header>
      <main className="member-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberPage;

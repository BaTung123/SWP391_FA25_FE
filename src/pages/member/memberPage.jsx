import React from 'react';
import { Outlet } from 'react-router-dom';

const MemberPage = () => {
  return (
    <div className="member-page">
      <main className="member-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MemberPage;

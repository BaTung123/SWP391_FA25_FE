import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Authentication</h1>
        </div>
        <div className="auth-content">
          <Outlet />
        </div>
        <div className="auth-footer">
          <p>Already have an account? <a href="/auth/login">Login</a></p>
          <p>Don't have an account? <a href="/auth/register">Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

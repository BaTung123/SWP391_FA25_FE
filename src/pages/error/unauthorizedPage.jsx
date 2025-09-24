import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="unauthorized-page">
      <div className="error-container">
        <h1>403 - Unauthorized Access</h1>
        <p>You don't have permission to access this page.</p>
        <div className="error-actions">
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/login" className="btn btn-secondary">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

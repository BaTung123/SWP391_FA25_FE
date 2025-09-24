import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="error-container">
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <div className="error-actions">
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/about" className="btn btn-secondary">About Us</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;

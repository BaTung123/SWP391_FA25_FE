import React from 'react';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <div className="root-layout">
      <header>
        <nav>
          <h1>My App</h1>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/auth/login">Login</a></li>
            <li><a href="/auth/register">Register</a></li>
          </ul>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2024 My App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default RootLayout;

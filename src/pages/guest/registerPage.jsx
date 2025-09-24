import React from 'react';

const RegisterPage = () => {
  return (
    <div className="register-page">
      <h1>Register</h1>
      <form>
        <div>
          <label htmlFor="name">Full Name:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;

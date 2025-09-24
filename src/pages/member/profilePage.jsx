import React from 'react';

const ProfilePage = () => {
  return (
    <div className="profile-page">
      <h1>User Profile</h1>
      <div className="profile-content">
        <div className="profile-info">
          <h2>Personal Information</h2>
          <p>Name: John Doe</p>
          <p>Email: john.doe@example.com</p>
          <p>Role: Customer</p>
        </div>
        <div className="profile-actions">
          <button>Edit Profile</button>
          <button>Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

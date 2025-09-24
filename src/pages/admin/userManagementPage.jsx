import React from 'react';

const UserManagementPage = () => {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Customer', status: 'Active' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'Staff', status: 'Inactive' },
  ];

  return (
    <div className="user-management">
      <h1>User Management</h1>
      <div className="user-actions">
        <button>Add New User</button>
        <button>Export Users</button>
      </div>
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;

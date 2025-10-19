import React, { useState } from 'react';
import { FaPlus, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const UserManagementPage = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', role: 'Thành viên', status: 'Hoạt động' },
    { id: 2, name: 'Trần Thị B', email: 'b@example.com', role: 'Thành viên', status: 'Hoạt động' },
    { id: 3, name: 'Lê Văn C', email: 'c@example.com', role: 'Nhân viên', status: 'Ngừng hoạt động' },
    { id: 4, name: 'Phạm Thị D', email: 'd@example.com', role: 'Thành viên', status: 'Hoạt động' },
    { id: 5, name: 'Hoàng Văn E', email: 'e@example.com', role: 'Nhân viên', status: 'Hoạt động' },
    { id: 6, name: 'Võ Thị F', email: 'f@example.com', role: 'Thành viên', status: 'Ngừng hoạt động' },
    { id: 7, name: 'Đặng Văn G', email: 'g@example.com', role: 'Nhân viên', status: 'Hoạt động' },
    { id: 8, name: 'Phan Thị H', email: 'h@example.com', role: 'Thành viên', status: 'Hoạt động' },
    { id: 9, name: 'Trương Văn I', email: 'i@example.com', role: 'Nhân viên', status: 'Ngừng hoạt động' },
    { id: 10, name: 'Đỗ Văn K', email: 'k@example.com', role: 'Thành viên', status: 'Hoạt động' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    return status === 'Hoạt động'
      ? <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Hoạt động</span>
      : <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Ngừng hoạt động</span>;
  };

  const toggleUserStatus = (userId) => {
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, status: user.status === 'Hoạt động' ? 'Ngừng hoạt động' : 'Hoạt động' }
        : user
    ));
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.password) {
      const user = {
        id: Math.max(...users.map(u => u.id)) + 1,
        name: newUser.name,
        email: newUser.email,
        role: 'Nhân viên',
        status: 'Hoạt động'
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', password: '' });
      setIsModalOpen(false);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FaPlus className="w-4 h-4 mr-2" />
          Thêm mới
        </button>
      </div>

      {/* Bảng danh sách người dùng */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tên người dùng</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors text-center">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-indigo-500 ${
                        user.status === 'Hoạt động' ? 'bg-indigo-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          user.status === 'Hoạt động' ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang */}
      <div className="flex items-center justify-center py-4">
        <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 border text-sm font-medium ${
                page === currentPage
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>

      {/* Modal thêm người dùng */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Thêm nhân viên mới</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-left"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-left"
                  placeholder="Nhập địa chỉ email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-left"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;

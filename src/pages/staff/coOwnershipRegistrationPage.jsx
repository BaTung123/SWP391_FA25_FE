import React, { useState } from 'react';
import { FaPlus, FaSearch, FaUser, FaCar, FaEye, FaEdit, FaTrash, FaCheck, FaTimes, FaLock, FaUnlock } from 'react-icons/fa';

const CoOwnershipRegistrationPage = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      vehicleName: 'Tesla Model 3 2023',
      licensePlate: '30A-12345',
      owner: 'John Doe',
      ownerEmail: 'john.doe@example.com',
      status: 'Available',
      visibility: 'Public',
      coOwners: [
        { name: 'John Doe', email: 'john.doe@example.com', percentage: 25, phone: '0123456789', status: 'Confirmed' }
      ],
      totalOwnership: 25,
      availableOwnership: 75,
      registrationDate: '2024-01-15',
      description: 'Tìm kiếm đồng sở hữu cho xe Tesla Model 3, phù hợp cho nhóm 2-4 người'
    },
    {
      id: 2,
      vehicleName: 'BYD Atto 3 2023',
      licensePlate: '29B-67890',
      owner: 'Nguyễn Văn A',
      ownerEmail: 'nguyenvana@example.com',
      status: 'Available',
      visibility: 'Private',
      coOwners: [
        { name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', percentage: 30, phone: '0987654321', status: 'Confirmed' }
      ],
      totalOwnership: 30,
      availableOwnership: 70,
      registrationDate: '2024-02-20',
      description: 'Tìm kiếm đồng sở hữu cho xe BYD Atto 3, chỉ dành cho bạn bè và người quen'
    },
    {
      id: 3,
      vehicleName: 'VinFast VF8 2023',
      licensePlate: '30C-11111',
      owner: 'Trần Thị B',
      ownerEmail: 'tranthib@example.com',
      status: 'In Progress',
      visibility: 'Public',
      coOwners: [
        { name: 'Trần Thị B', email: 'tranthib@example.com', percentage: 20, phone: '0912345678', status: 'Confirmed' },
        { name: 'Lê Văn C', email: 'levanc@example.com', percentage: 15, phone: '0923456789', status: 'Pending' }
      ],
      totalOwnership: 35,
      availableOwnership: 65,
      registrationDate: '2024-03-10',
      description: 'Tìm kiếm đồng sở hữu cho xe VinFast VF8, đã có 1 người tham gia'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [visibilityFilter, setVisibilityFilter] = useState('All Visibility');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // New registration form state
  const [newRegistration, setNewRegistration] = useState({
    vehicleName: '',
    licensePlate: '',
    owner: '',
    ownerEmail: '',
    ownerPhone: '',
    visibility: 'Public',
    description: '',
    availableOwnership: 100
  });

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.ownerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || vehicle.status === statusFilter;
    const matchesVisibility = visibilityFilter === 'All Visibility' || vehicle.visibility === visibilityFilter;
    return matchesSearch && matchesStatus && matchesVisibility;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleAddRegistration = () => {
    if (newRegistration.vehicleName && newRegistration.licensePlate && newRegistration.owner && newRegistration.ownerEmail) {
      const registration = {
        id: Math.max(...vehicles.map(v => v.id)) + 1,
        vehicleName: newRegistration.vehicleName,
        licensePlate: newRegistration.licensePlate,
        owner: newRegistration.owner,
        ownerEmail: newRegistration.ownerEmail,
        status: 'Available',
        visibility: newRegistration.visibility,
        coOwners: [
          { 
            name: newRegistration.owner, 
            email: newRegistration.ownerEmail, 
            percentage: 100 - newRegistration.availableOwnership, 
            phone: newRegistration.ownerPhone, 
            status: 'Confirmed' 
          }
        ],
        totalOwnership: 100 - newRegistration.availableOwnership,
        availableOwnership: newRegistration.availableOwnership,
        registrationDate: new Date().toISOString().split('T')[0],
        description: newRegistration.description
      };
      setVehicles([...vehicles, registration]);
      setNewRegistration({
        vehicleName: '',
        licensePlate: '',
        owner: '',
        ownerEmail: '',
        ownerPhone: '',
        visibility: 'Public',
        description: '',
        availableOwnership: 100
      });
      setShowAddModal(false);
    }
  };

  const handleInputChange = (e) => {
    setNewRegistration({
      ...newRegistration,
      [e.target.name]: e.target.value
    });
  };

  const handleViewDetails = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Available': 'bg-green-100 text-green-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-gray-100 text-gray-800',
      'Cancelled': 'bg-red-100 text-red-800'
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}>
        {status}
      </span>
    );
  };

  const getVisibilityIcon = (visibility) => {
    return visibility === 'Public' ? <FaUnlock className="w-4 h-4" /> : <FaLock className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Đăng ký đồng sở hữu</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          Đăng ký mới
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên xe, biển số, chủ xe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>Tất cả trạng thái</option>
            <option>Available</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
          <select 
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option>Tất cả quyền riêng tư</option>
            <option>Public</option>
            <option>Private</option>
          </select>
        </div>
      </div>

      {/* Registration List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Danh sách đăng ký đồng sở hữu</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thông tin xe
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chủ xe
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quyền riêng tư
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Sở hữu
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentVehicles.map(vehicle => (
                <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <FaCar className="w-8 h-8 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vehicle.vehicleName}</div>
                        <div className="text-sm text-gray-500">{vehicle.licensePlate}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vehicle.owner}</div>
                      <div className="text-sm text-gray-500">{vehicle.ownerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      {getVisibilityIcon(vehicle.visibility)}
                      <span className="ml-2 text-sm text-gray-900">{vehicle.visibility}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${vehicle.totalOwnership}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{vehicle.totalOwnership}%</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Còn lại: {vehicle.availableOwnership}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {getStatusBadge(vehicle.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {new Date(vehicle.registrationDate).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleViewDetails(vehicle)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Xem chi tiết"
                      >
                        <FaEye />
                      </button>
                      <button className="text-green-600 hover:text-green-900 p-1" title="Chỉnh sửa">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-900 p-1" title="Xóa">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-center py-4">
        <div className="flex justify-center sm:hidden">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </div>
        <div className="hidden sm:block">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === currentPage
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                );
              }
              return null;
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </nav>
        </div>
      </div>

      {/* Add Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Đăng ký đồng sở hữu mới</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên xe
                  </label>
                  <input
                    type="text"
                    name="vehicleName"
                    value={newRegistration.vehicleName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên xe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Biển số xe
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={newRegistration.licensePlate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập biển số xe"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên chủ xe
                  </label>
                  <input
                    type="text"
                    name="owner"
                    value={newRegistration.owner}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập họ và tên"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="ownerEmail"
                    value={newRegistration.ownerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="ownerPhone"
                    value={newRegistration.ownerPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quyền riêng tư
                  </label>
                  <select
                    name="visibility"
                    value={newRegistration.visibility}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Public">Công khai</option>
                    <option value="Private">Riêng tư</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  % Sở hữu muốn chia sẻ
                </label>
                <input
                  type="range"
                  name="availableOwnership"
                  value={newRegistration.availableOwnership}
                  onChange={handleInputChange}
                  min="10"
                  max="90"
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>10%</span>
                  <span className="font-medium">{newRegistration.availableOwnership}%</span>
                  <span>90%</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={newRegistration.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả về xe và yêu cầu đồng sở hữu"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddRegistration}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Chi tiết đăng ký - {selectedVehicle.vehicleName}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vehicle Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin xe</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tên xe:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedVehicle.vehicleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Biển số:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedVehicle.licensePlate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Quyền riêng tư:</span>
                    <span className="text-sm font-medium text-gray-900 flex items-center">
                      {getVisibilityIcon(selectedVehicle.visibility)}
                      <span className="ml-1">{selectedVehicle.visibility}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    {getStatusBadge(selectedVehicle.status)}
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin chủ xe</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Họ và tên:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedVehicle.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedVehicle.ownerEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ngày đăng ký:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(selectedVehicle.registrationDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ownership Information */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Thông tin sở hữu</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedVehicle.totalOwnership}%</div>
                  <div className="text-sm text-gray-600">Đã sở hữu</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedVehicle.availableOwnership}%</div>
                  <div className="text-sm text-gray-600">Còn lại</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{selectedVehicle.coOwners.length}</div>
                  <div className="text-sm text-gray-600">Đồng sở hữu</div>
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedVehicle.description && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h4>
                <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{selectedVehicle.description}</p>
              </div>
            )}

            {/* Co-owners List */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Danh sách đồng sở hữu</h4>
              <div className="space-y-3">
                {selectedVehicle.coOwners.map((owner, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FaUser className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{owner.name}</h5>
                          <p className="text-sm text-gray-600">{owner.email}</p>
                          <p className="text-sm text-gray-500">{owner.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${owner.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-lg font-bold text-blue-900">{owner.percentage}%</span>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          owner.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {owner.status === 'Confirmed' ? 'Đã xác nhận' : 'Chờ xác nhận'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Đóng
              </button>
              <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                Phê duyệt
              </button>
              <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoOwnershipRegistrationPage;

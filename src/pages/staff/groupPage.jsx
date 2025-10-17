import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaChevronLeft, FaChevronRight, FaUserPlus, FaTimes, FaFileContract } from 'react-icons/fa';

const GroupManagementPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Tesla Model 3 Group",
      vehicle: "Tesla Model 3 2023",
      license: "DEF-456",
      createdDate: "2024-01-15",
      members: [
        { id: 1, name: "Nguyễn Văn A", email: "a@email.com", phone: "0123456789", ownershipPercentage: 40 },
        { id: 2, name: "Trần Thị B", email: "b@email.com", phone: "0987654321", ownershipPercentage: 35 },
        { id: 3, name: "Lê Văn C", email: "c@email.com", phone: "0555666777", ownershipPercentage: 25 }
      ]
    },
    {
      id: 2,
      name: "BMW X5 Group",
      vehicle: "BMW X5 2023",
      license: "GHI-789",
      createdDate: "2024-01-10",
      members: [
        { id: 4, name: "Phạm Văn D", email: "d@email.com", phone: "0111222333", ownershipPercentage: 50 },
        { id: 5, name: "Hoàng Thị E", email: "e@email.com", phone: "0444555666", ownershipPercentage: 30 },
        { id: 6, name: "Vũ Văn F", email: "f@email.com", phone: "0777888999", ownershipPercentage: 20 }
      ]
    },
    {
      id: 3,
      name: "Toyota Camry Group",
      vehicle: "Toyota Camry 2023",
      license: "ABC-123",
      createdDate: "2024-02-01",
      members: [
        { id: 7, name: "Đặng Văn G", email: "g@email.com", phone: "0333444555", ownershipPercentage: 60 },
        { id: 8, name: "Bùi Thị H", email: "h@email.com", phone: "0666777888", ownershipPercentage: 40 }
      ]
    },
    {
      id: 4,
      name: "Mercedes C-Class Group",
      vehicle: "Mercedes C-Class 2023",
      license: "JKL-012",
      createdDate: "2024-02-05",
      members: [
        { id: 9, name: "Ngô Văn I", email: "i@email.com", phone: "0999000111", ownershipPercentage: 50 },
        { id: 10, name: "Đinh Thị J", email: "j@email.com", phone: "0222333444", ownershipPercentage: 50 }
      ]
    },
    {
      id: 5,
      name: "Audi A4 Group",
      vehicle: "Audi A4 2023",
      license: "MNO-345",
      createdDate: "2024-02-10",
      members: [
        { id: 11, name: "Lý Văn K", email: "k@email.com", phone: "0555666777", ownershipPercentage: 100 }
      ]
    }
  ]);
  const [newGroup, setNewGroup] = useState({
    name: '',
    vehicle: ''
  });
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    ownershipPercentage: 25
  });
  const [editGroup, setEditGroup] = useState({
    name: '',
    vehicle: ''
  });


  // Filter and search logic
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || group.vehicle.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const handleCreateGroup = () => {
    if (newGroup.name && newGroup.vehicle) {
      const newId = Math.max(...groups.map(g => g.id)) + 1;
      const newGroupData = {
        id: newId,
        name: newGroup.name,
        vehicle: newGroup.vehicle,
        license: "NEW-" + Math.floor(Math.random() * 1000),
        createdDate: new Date().toISOString().split('T')[0],
        members: []
      };
      setGroups([...groups, newGroupData]);
      setShowCreateModal(false);
      setNewGroup({ name: '', vehicle: '' });
    }
  };

  const handleViewMembers = (group) => {
    setSelectedGroup(group);
    setShowMembersModal(true);
  };

  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setEditGroup({ name: group.name, vehicle: group.vehicle });
    setShowEditModal(true);
  };

  const handleUpdateGroup = () => {
    if (editGroup.name && editGroup.vehicle) {
      setGroups(groups.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, name: editGroup.name, vehicle: editGroup.vehicle }
          : group
      ));
      setShowEditModal(false);
      setEditGroup({ name: '', vehicle: '' });
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhóm này?')) {
      setGroups(groups.filter(group => group.id !== groupId));
    }
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.phone) {
      const newMemberId = Math.max(...selectedGroup.members.map(m => m.id)) + 1;
      const memberToAdd = {
        id: newMemberId,
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
        ownershipPercentage: newMember.ownershipPercentage
      };
      
      setGroups(groups.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, members: [...group.members, memberToAdd] }
          : group
      ));
      
      setSelectedGroup({...selectedGroup, members: [...selectedGroup.members, memberToAdd]});
      setNewMember({ name: '', email: '', phone: '', ownershipPercentage: 25 });
    }
  };

  const handleUpdateOwnership = (memberId, newPercentage) => {
    if (newPercentage >= 1 && newPercentage <= 100) {
      setGroups(groups.map(group => 
        group.id === selectedGroup.id 
          ? {
              ...group,
              members: group.members.map(member =>
                member.id === memberId 
                  ? { ...member, ownershipPercentage: newPercentage }
                  : member
              )
            }
          : group
      ));
      
      setSelectedGroup({
        ...selectedGroup,
        members: selectedGroup.members.map(member =>
          member.id === memberId 
            ? { ...member, ownershipPercentage: newPercentage }
            : member
        )
      });
    }
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
      setGroups(groups.map(group => 
        group.id === selectedGroup.id 
          ? { ...group, members: group.members.filter(member => member.id !== memberId) }
          : group
      ));
      
      setSelectedGroup({
        ...selectedGroup,
        members: selectedGroup.members.filter(member => member.id !== memberId)
      });
    }
  };

  const handleViewContract = (member) => {
    setSelectedMember(member);
    setShowContractModal(true);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setCurrentPage(1);
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý nhóm đồng sở hữu</h1>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          Tạo nhóm mới
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
                placeholder="Tìm kiếm nhóm..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <select 
            value={filterType}
            onChange={handleFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả loại xe</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="electric">Electric</option>
            <option value="hatchback">Hatchback</option>
          </select>
        </div>
      </div>

      {/* Groups List */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên nhóm
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xe
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentGroups.map((group) => (
                <tr key={group.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="text-sm font-medium text-gray-900">{group.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{group.vehicle}</div>
                      <div className="text-sm text-gray-500">{group.license}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className="text-sm text-gray-900">{group.createdDate}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                    <button 
                      onClick={() => handleViewMembers(group)}
                      className="text-blue-600 hover:text-blue-900 mr-3" 
                      title="Xem thành viên"
                    >
                      <FaEye />
                    </button>
                    <button 
                      onClick={() => handleEditGroup(group)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3" 
                      title="Chỉnh sửa nhóm"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-red-600 hover:text-red-900" 
                      title="Xóa nhóm"
                    >
                      <FaTrash />
                    </button>
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
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:block">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaChevronLeft className="h-4 w-4" />
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
              <FaChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>

      {/* View Members Modal */}
      {showMembersModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Thành viên nhóm: {selectedGroup.name}
              </h3>
              <button
                onClick={() => setShowMembersModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Thông tin xe</h4>
              <p className="text-gray-700">{selectedGroup.vehicle} - {selectedGroup.license}</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Danh sách thành viên</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên thành viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số điện thoại
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Sở hữu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedGroup.members.map((member) => (
                      <tr key={member.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {member.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {member.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={member.ownershipPercentage}
                              onChange={(e) => handleUpdateOwnership(member.id, parseInt(e.target.value))}
                              className="w-20 px-2 py-1 border border-gray-300 rounded-md text-sm"
                            />
                            <span className="ml-2 text-sm text-gray-500">%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewContract(member)}
                              className="text-blue-600 hover:text-blue-900" 
                              title="Xem hợp đồng"
                            >
                              <FaFileContract />
                            </button>
                            <button 
                              onClick={() => handleDeleteMember(member.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Xóa thành viên"
                            >
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
          </div>
        </div>
      )}

      {/* Edit Group Modal */}
      {showEditModal && selectedGroup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Chỉnh sửa nhóm: {selectedGroup.name}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Tên nhóm
                </label>
                <input
                  type="text"
                  value={editGroup.name}
                  onChange={(e) => setEditGroup({...editGroup, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Xe
                </label>
                <select 
                  value={editGroup.vehicle}
                  onChange={(e) => setEditGroup({...editGroup, vehicle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn xe...</option>
                  <option value="Tesla Model 3 2023">Tesla Model 3 2023</option>
                  <option value="BMW X5 2023">BMW X5 2023</option>
                  <option value="Toyota Camry 2023">Toyota Camry 2023</option>
                  <option value="Mercedes C-Class 2023">Mercedes C-Class 2023</option>
                  <option value="Audi A4 2023">Audi A4 2023</option>
                </select>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-4">Thêm thành viên mới</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Tên thành viên
                    </label>
                    <input
                      type="text"
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      placeholder="Nhập tên..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                      placeholder="Nhập email..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                      placeholder="Nhập số điện thoại..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                      % Sở hữu
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newMember.ownershipPercentage}
                      onChange={(e) => setNewMember({...newMember, ownershipPercentage: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button 
                onClick={handleUpdateGroup}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Cập nhật nhóm
              </button>
              <button 
                onClick={handleAddMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                Thêm thành viên
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contract Modal */}
      {showContractModal && selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Hợp đồng đồng sở hữu - {selectedMember.name}
              </h3>
              <button
                onClick={() => setShowContractModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Thông tin thành viên</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tên: <span className="font-medium">{selectedMember.name}</span></p>
                  <p className="text-sm text-gray-600">Email: <span className="font-medium">{selectedMember.email}</span></p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số điện thoại: <span className="font-medium">{selectedMember.phone}</span></p>
                  <p className="text-sm text-gray-600">% Sở hữu: <span className="font-medium">{selectedMember.ownershipPercentage}%</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Chi tiết hợp đồng</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã hợp đồng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Loại hợp đồng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày ký
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày hết hạn
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giá trị
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        HD-{selectedMember.id.toString().padStart(3, '0')}-001
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Hợp đồng đồng sở hữu xe
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2024-01-15
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2025-01-15
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Có hiệu lực
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {selectedMember.ownershipPercentage}% quyền sở hữu
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        HD-{selectedMember.id.toString().padStart(3, '0')}-002
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Phụ lục bảo hiểm
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2024-02-01
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2025-02-01
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Có hiệu lực
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Bảo hiểm toàn diện
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        HD-{selectedMember.id.toString().padStart(3, '0')}-003
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Thỏa thuận sử dụng
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2024-01-20
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        2025-01-20
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Chờ duyệt
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        Quy tắc sử dụng chung
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-semibold text-blue-900 mb-2">Ghi chú quan trọng</h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Tất cả hợp đồng đều có giá trị pháp lý và được bảo vệ bởi pháp luật</li>
                <li>• Thành viên có thể yêu cầu sao chép hợp đồng bất kỳ lúc nào</li>
                <li>• Mọi thay đổi về quyền sở hữu cần được thông báo trước 30 ngày</li>
                <li>• Hợp đồng sẽ tự động gia hạn nếu không có thông báo chấm dứt</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Tạo nhóm đồng sở hữu mới</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Tên nhóm
                </label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({...newGroup, name: e.target.value})}
                  placeholder="Nhập tên nhóm..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Chọn xe
                </label>
                <select
                  value={newGroup.vehicle}
                  onChange={(e) => setNewGroup({...newGroup, vehicle: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn xe...</option>
                  <option value="Tesla Model 3 2023">Tesla Model 3 2023</option>
                  <option value="BMW X5 2023">BMW X5 2023</option>
                  <option value="Toyota Camry 2023">Toyota Camry 2023</option>
                  <option value="Mercedes C-Class 2023">Mercedes C-Class 2023</option>
                  <option value="Audi A4 2023">Audi A4 2023</option>
                </select>
              </div>

            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Tạo nhóm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagementPage;

import React, { useState } from 'react';
import {
  FaCar,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from 'react-icons/fa';

const VehicleManagementPage = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      name: 'VinFast VF8 2023',
      licensePlate: 'VN-001',
      type: 'Điện',
      status: 'Sẵn sàng',
      owners: [
        { name: 'Nguyễn Văn A', percentage: 60 },
        { name: 'Trần Thị B', percentage: 40 },
      ],
    },
    {
      id: 2,
      name: 'Tesla Model Y',
      licensePlate: 'VN-002',
      type: 'Điện',
      status: 'Đang sử dụng',
      owners: [{ name: 'Lê Hoàng', percentage: 100 }],
    },
    {
      id: 3,
      name: 'Kia EV6',
      licensePlate: 'VN-003',
      type: 'Điện',
      status: 'Bảo trì',
      owners: [
        { name: 'Phạm Hương', percentage: 70 },
        { name: 'Võ Tấn', percentage: 30 },
      ],
    },
    {
      id: 4,
      name: 'Hyundai Ioniq 5',
      licensePlate: 'VN-004',
      type: 'Điện',
      status: 'Sẵn sàng',
      owners: [{ name: 'Đặng Hà', percentage: 100 }],
    },
    {
      id: 5,
      name: 'BYD Atto 3',
      licensePlate: 'VN-005',
      type: 'Điện',
      status: 'Sẵn sàng',
      owners: [
        { name: 'Hoàng Minh', percentage: 80 },
        { name: 'Lê Mai', percentage: 20 },
      ],
    },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [newVehicle, setNewVehicle] = useState({
    name: '',
    licensePlate: '',
    type: 'Điện',
    owners: [{ name: '', percentage: 100 }],
  });

  // Phân trang
  const totalPages = Math.ceil(vehicles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentVehicles = vehicles.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  // Thêm xe
  const handleAddVehicle = () => {
    const totalPercentage = newVehicle.owners.reduce(
      (sum, owner) => sum + (owner.percentage || 0),
      0
    );
    if (totalPercentage !== 100) {
      alert('Tổng phần trăm sở hữu phải bằng 100%');
      return;
    }

    if (newVehicle.name && newVehicle.licensePlate) {
      const vehicle = {
        id: Math.max(...vehicles.map((v) => v.id)) + 1,
        ...newVehicle,
        status: 'Sẵn sàng',
      };
      setVehicles([...vehicles, vehicle]);
      setNewVehicle({
        name: '',
        licensePlate: '',
        type: 'Điện',
        owners: [{ name: '', percentage: 100 }],
      });
      setIsAddModalOpen(false);
    }
  };

  const handleInputChange = (e) => {
    setNewVehicle({
      ...newVehicle,
      [e.target.name]: e.target.value,
    });
  };

  const handleOwnerChange = (index, field, value) => {
    const newOwners = [...newVehicle.owners];
    newOwners[index][field] =
      field === 'percentage' ? parseInt(value) || 0 : value;
    setNewVehicle({
      ...newVehicle,
      owners: newOwners,
    });
  };

  const addOwner = () => {
    setNewVehicle({
      ...newVehicle,
      owners: [...newVehicle.owners, { name: '', percentage: 0 }],
    });
  };

  const removeOwner = (index) => {
    if (newVehicle.owners.length > 1) {
      const newOwners = newVehicle.owners.filter((_, i) => i !== index);
      setNewVehicle({
        ...newVehicle,
        owners: newOwners,
      });
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Sẵn sàng': 'bg-green-100 text-green-800',
      'Đang sử dụng': 'bg-yellow-100 text-yellow-800',
      'Bảo trì': 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề và nút thêm */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Quản lý xe điện đồng sở hữu
        </h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          Thêm xe mới
        </button>
      </div>

      {/* Bảng danh sách xe */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-center">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Tên xe
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentVehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {vehicle.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Biển số: {vehicle.licensePlate}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(vehicle.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedVehicle(vehicle);
                        setIsDetailModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <FaEye />
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-900">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

      {/* Modal thêm xe */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Thêm xe điện mới
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên xe
                </label>
                <input
                  type="text"
                  name="name"
                  value={newVehicle.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên xe"
                  className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biển số xe
                </label>
                <input
                  type="text"
                  name="licensePlate"
                  value={newVehicle.licensePlate}
                  onChange={handleInputChange}
                  placeholder="Nhập biển số xe"
                  className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Thông tin đồng sở hữu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thông tin chủ sở hữu
                </label>
                <div className="space-y-3">
                  {newVehicle.owners.map((owner, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input
                        type="text"
                        value={owner.name}
                        onChange={(e) =>
                          handleOwnerChange(index, 'name', e.target.value)
                        }
                        placeholder="Tên chủ sở hữu"
                        className="flex-1 border px-3 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        value={owner.percentage}
                        onChange={(e) =>
                          handleOwnerChange(index, 'percentage', e.target.value)
                        }
                        className="w-20 border px-3 py-2 rounded-md"
                        placeholder="%"
                        min="0"
                        max="100"
                      />
                      <button
                        type="button"
                        onClick={() => removeOwner(index)}
                        disabled={newVehicle.owners.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addOwner}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                  >
                    <FaPlus className="mr-1" /> Thêm chủ sở hữu
                  </button>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Tổng phần trăm:{" "}
                  {newVehicle.owners.reduce(
                    (sum, owner) => sum + (owner.percentage || 0),
                    0
                  )}
                  %
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddVehicle}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Thêm xe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết xe */}
      {isDetailModalOpen && selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Chi tiết xe
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-center">
                <FaCar className="text-blue-600 w-8 h-8 mr-2" />
                <div>
                  <div className="text-lg font-semibold">
                    {selectedVehicle.name}
                  </div>
                  <div className="text-gray-500">
                    Biển số: {selectedVehicle.licensePlate}
                  </div>
                </div>
              </div>
              <div className="text-center">
                {getStatusBadge(selectedVehicle.status)}
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Chủ sở hữu:</h4>
                <div className="space-y-2">
                  {selectedVehicle.owners.map((o, i) => (
                    <div
                      key={i}
                      className="flex justify-between bg-gray-50 px-3 py-2 rounded"
                    >
                      <span>{o.name}</span>
                      <span className="font-medium text-blue-600">
                        {o.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagementPage;

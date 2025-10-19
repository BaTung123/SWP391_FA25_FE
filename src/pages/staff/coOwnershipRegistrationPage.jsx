import React, { useState } from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';

const CoOwnershipRegistrationPage = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      vehicleName: 'Tesla Model 3 2023',
      licensePlate: '30A-12345',
      owner: 'John Doe',
      ownerEmail: 'john.doe@example.com',
      status: 'Available',
      coOwners: [
        { name: 'John Doe', email: 'john.doe@example.com', percentage: 25, phone: '0123456789', status: 'Confirmed' }
      ],
      totalOwnership: 25,
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
      coOwners: [
        { name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', percentage: 30, phone: '0987654321', status: 'Confirmed' }
      ],
      totalOwnership: 30,
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
      coOwners: [
        { name: 'Trần Thị B', email: 'tranthib@example.com', percentage: 20, phone: '0912345678', status: 'Confirmed' },
        { name: 'Lê Văn C', email: 'levanc@example.com', percentage: 15, phone: '0923456789', status: 'Pending' }
      ],
      totalOwnership: 35,
      registrationDate: '2024-03-10',
      description: 'Tìm kiếm đồng sở hữu cho xe VinFast VF8, đã có 1 người tham gia'
    }
  ]);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Hàm dịch trạng thái sang tiếng Việt
  const translateStatus = (status) => {
    switch (status) {
      case 'Available':
        return 'Còn trống';
      case 'In Progress':
        return 'Đang tiến hành';
      case 'Completed':
        return 'Hoàn thành';
      case 'Cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Available: 'bg-green-100 text-green-700',
      'In Progress': 'bg-blue-100 text-blue-700',
      Completed: 'bg-gray-100 text-gray-700',
      Cancelled: 'bg-red-100 text-red-700'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || ''}`}>
        {translateStatus(status)}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Đăng ký đồng sở hữu</h1>
        <button
          onClick={() => alert("Chức năng đăng ký mới đang được phát triển!")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Đăng ký mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3 text-center">Tên xe</th>
              <th className="px-6 py-3 text-center">Chủ xe</th>
              <th className="px-6 py-3 text-center">% Sở hữu</th>
              <th className="px-6 py-3 text-center">Trạng thái</th>
              <th className="px-6 py-3 text-center">Ngày đăng ký</th>
              <th className="px-6 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-center">{vehicle.vehicleName}</td>
                <td className="px-6 py-4 text-center">{vehicle.owner}</td>
                <td className="px-6 py-4 text-center font-semibold">{vehicle.totalOwnership}%</td>
                <td className="px-6 py-4 text-center">{getStatusBadge(vehicle.status)}</td>
                <td className="px-6 py-4 text-center">{vehicle.registrationDate}</td>
                <td className="px-6 py-4 text-center flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setShowDetailModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEye />
                  </button>
                  <button className="text-green-600 hover:text-green-800">
                    <FaEdit />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedVehicle && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Chi tiết - {selectedVehicle.vehicleName}
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Thông tin xe</h3>
                <p><strong>Biển số:</strong> {selectedVehicle.licensePlate}</p>
                <p><strong>Chủ xe:</strong> {selectedVehicle.owner} ({selectedVehicle.ownerEmail})</p>
                <p><strong>Trạng thái:</strong> {translateStatus(selectedVehicle.status)}</p>
                <p><strong>Ngày đăng ký:</strong> {selectedVehicle.registrationDate}</p>
                <p><strong>Mô tả:</strong> {selectedVehicle.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Danh sách đồng sở hữu</h3>
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Họ tên</th>
                      <th className="px-4 py-2 text-left">Email</th>
                      <th className="px-4 py-2 text-center">% Sở hữu</th>
                      <th className="px-4 py-2 text-center">SĐT</th>
                      <th className="px-4 py-2 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVehicle.coOwners.map((co, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{co.name}</td>
                        <td className="px-4 py-2">{co.email}</td>
                        <td className="px-4 py-2 text-center">{co.percentage}%</td>
                        <td className="px-4 py-2 text-center">{co.phone}</td>
                        <td className="px-4 py-2 text-center">
                          {co.status === 'Confirmed' ? (
                            <span className="text-green-600 font-medium">Đã xác nhận</span>
                          ) : (
                            <span className="text-yellow-600 font-medium">Chờ duyệt</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoOwnershipRegistrationPage;

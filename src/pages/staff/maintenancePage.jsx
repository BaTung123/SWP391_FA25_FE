import React, { useState } from "react";
import {
  FaCog,
  FaPlus,
  FaEdit,
  FaCheck,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const MaintenancePage = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([
    {
      id: 1,
      vehicle: { name: "Toyota Camry 2023", license: "ABC-123" },
      type: "Bảo dưỡng định kỳ",
      scheduledDate: "2024-02-15",
      status: "Đã lên lịch",
      description: "Thay dầu và kiểm tra tổng quát",
    },
    {
      id: 2,
      vehicle: { name: "Honda Civic 2023", license: "XYZ-789" },
      type: "Sửa chữa",
      scheduledDate: "2024-02-10",
      status: "Quá hạn",
      description: "Sửa hệ thống phanh",
    },
    {
      id: 3,
      vehicle: { name: "Tesla Model 3 2023", license: "DEF-456" },
      type: "Kiểm định",
      scheduledDate: "2024-02-20",
      status: "Đang thực hiện",
      description: "Kiểm tra an toàn hàng năm",
    },
    {
      id: 4,
      vehicle: { name: "BMW X5 2023", license: "GHI-789" },
      type: "Bảo dưỡng định kỳ",
      scheduledDate: "2024-02-12",
      status: "Hoàn thành",
      description: "Điều chỉnh động cơ và thay lọc gió",
    },
    {
      id: 5,
      vehicle: { name: "Ford F-150 2023", license: "JKL-012" },
      type: "Khẩn cấp",
      scheduledDate: "2024-02-18",
      status: "Đã lên lịch",
      description: "Sửa hộp số",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [newMaintenance, setNewMaintenance] = useState({
    vehicle: "",
    type: "Bảo dưỡng định kỳ",
    scheduledDate: "",
    description: "",
  });

  const totalPages = Math.ceil(maintenanceRecords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentRecords = maintenanceRecords.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleAddMaintenance = () => {
    if (
      newMaintenance.vehicle &&
      newMaintenance.scheduledDate &&
      newMaintenance.description
    ) {
      const newId =
        maintenanceRecords.length > 0
          ? Math.max(...maintenanceRecords.map((r) => r.id)) + 1
          : 1;

      const record = {
        id: newId,
        vehicle: { name: newMaintenance.vehicle, license: "Đang cập nhật" },
        type: newMaintenance.type,
        scheduledDate: newMaintenance.scheduledDate,
        status: "Đã lên lịch",
        description: newMaintenance.description,
      };

      setMaintenanceRecords([...maintenanceRecords, record]);
      setNewMaintenance({
        vehicle: "",
        type: "Bảo dưỡng định kỳ",
        scheduledDate: "",
        description: "",
      });
      setIsModalOpen(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMaintenance({ ...newMaintenance, [e.target.name]: e.target.value });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      "Đã lên lịch": "bg-yellow-100 text-yellow-800",
      "Đang thực hiện": "bg-blue-100 text-blue-800",
      "Hoàn thành": "bg-green-100 text-green-800",
      "Quá hạn": "bg-red-100 text-red-800",
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Quản lý bảo dưỡng xe
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          Lên lịch bảo dưỡng
        </button>
      </div>

      {/* Danh sách bảo dưỡng */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xe
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại bảo dưỡng
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày thực hiện
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{record.vehicle.name}</div>
                    <div className="text-gray-500 text-sm">
                      Biển số: {record.vehicle.license}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.scheduledDate}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                  <td
                    className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs"
                    title={record.description}
                  >
                    {record.description}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Đánh dấu hoàn thành"
                      >
                        <FaCheck />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang */}
      <div className="flex items-center justify-center py-4">
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                page === currentPage
                  ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </nav>
      </div>

      {/* Modal thêm mới */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Lên lịch bảo dưỡng
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Tên xe
                  </label>
                </div>
                <input
                  type="text"
                  name="vehicle"
                  value={newMaintenance.vehicle}
                  onChange={handleInputChange}
                  placeholder="Nhập tên xe..."
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Loại bảo dưỡng
                  </label>
                </div>
                <select
                  name="type"
                  value={newMaintenance.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Bảo dưỡng định kỳ">Bảo dưỡng định kỳ</option>
                  <option value="Sửa chữa">Sửa chữa</option>
                  <option value="Kiểm định">Kiểm định</option>
                  <option value="Khẩn cấp">Khẩn cấp</option>
                </select>
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Ngày dự kiến
                  </label>
                </div>
                <input
                  type="date"
                  name="scheduledDate"
                  value={newMaintenance.scheduledDate}
                  onChange={handleInputChange}
                  placeholder="mm/dd/yyyy"
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Mô tả
                  </label>
                </div>
                <textarea
                  name="description"
                  value={newMaintenance.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả chi tiết..."
                  rows={3}
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddMaintenance}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Xác nhận lên lịch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;

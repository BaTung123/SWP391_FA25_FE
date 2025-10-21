import React from 'react';
import {
  FaUsers,
  FaChartLine,
  FaCalendarAlt,
  FaCar
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const AdminDashboardPage = () => {
  // Dữ liệu cho Biểu đồ xu hướng phí dịch vụ
  const serviceFeeData = [
    { month: 'Th1', fee: 12000 },
    { month: 'Th2', fee: 15000 },
    { month: 'Th3', fee: 18000 },
    { month: 'Th4', fee: 22000 },
    { month: 'Th5', fee: 25000 },
    { month: 'Th6', fee: 30000 },
    { month: 'Th7', fee: 27000 },
    { month: 'Th8', fee: 32000 },
    { month: 'Th9', fee: 34000 },
    { month: 'Th10', fee: 45678 },
  ];

  // Dữ liệu cho Biểu đồ sử dụng xe
  const vehicleData = [
    { name: 'Đang hoạt động', value: 65 },
    { name: 'Bảo trì', value: 20 },
    { name: 'Đang rảnh', value: 15 },
  ];
  const COLORS = ['#16a34a', '#facc15', '#60a5fa'];

  return (
    <div className="space-y-6">
      {/* Tiêu đề */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Bảng điều khiển quản trị
        </h1>
      </div>

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <FaUsers className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Tổng số người dùng
              </p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <FaCar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Xe đang hoạt động
              </p>
              <p className="text-2xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <FaChartLine className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Phí dịch vụ
              </p>
              <p className="text-2xl font-bold text-gray-900">45,678₫</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <FaCalendarAlt className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Lịch đặt xe
              </p>
              <p className="text-2xl font-bold text-gray-900">456</p>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ xu hướng phí dịch vụ */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Xu hướng phí dịch vụ
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={serviceFeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="fee"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Biểu đồ sử dụng xe */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tình trạng sử dụng xe
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vehicleData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                  fill="#8884d8"
                  label
                >
                  {vehicleData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Hoạt động gần đây
        </h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-gray-700">
              Thêm xe mới: Tesla Model 3
            </span>
            <span className="ml-auto text-sm text-gray-500">
              2 giờ trước
            </span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-gray-700">
              Người dùng John Doe hoàn tất đặt xe
            </span>
            <span className="ml-auto text-sm text-gray-500">
              4 giờ trước
            </span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            <span className="text-gray-700">Đã lên lịch bảo trì xe</span>
            <span className="ml-auto text-sm text-gray-500">
              6 giờ trước
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

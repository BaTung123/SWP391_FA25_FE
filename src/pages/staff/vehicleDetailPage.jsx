import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const MOCK_VEHICLES = [
  { 
    id: 1, 
    name: "VinFast VF e34", 
    licensePlate: "30A-12345", 
    batteryLevel: 85, 
    totalKm: 15420, 
    lastMaintenance: "2024-01-15",
    insurance: "Bảo hiểm TNDS",
    status: "Hoạt động tốt"
  },
  { 
    id: 2, 
    name: "Tesla Model 3", 
    licensePlate: "30B-67890", 
    batteryLevel: 92, 
    totalKm: 12850, 
    lastMaintenance: "2024-01-20",
    insurance: "Bảo hiểm toàn diện",
    status: "Hoạt động tốt"
  },
  { 
    id: 3, 
    name: "Hyundai Ioniq 5", 
    licensePlate: "30C-11111", 
    batteryLevel: 78, 
    totalKm: 9850, 
    lastMaintenance: "2024-02-01",
    insurance: "Bảo hiểm TNDS",
    status: "Cần bảo dưỡng"
  },
];

export default function VehicleDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-lg">
      <button
        className="mb-6 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
        onClick={() => navigate("/staff/manage-ownership-groups")}
      >
        ← Quay lại
      </button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-orange-700 mb-2">Chi tiết xe nhóm {groupId}</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_VEHICLES.map((vehicle, index) => (
          <div key={vehicle.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                🚗
              </div>
              <h3 className="text-xl font-bold text-gray-800">{vehicle.name}</h3>
              <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">🔋 Pin:</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className={`h-2 rounded-full ${vehicle.batteryLevel > 80 ? 'bg-green-500' : vehicle.batteryLevel > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${vehicle.batteryLevel}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-800">{vehicle.batteryLevel}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">🛣️ Tổng km:</span>
                <span className="text-sm text-blue-600 font-semibold">{vehicle.totalKm.toLocaleString()} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">🔧 Bảo dưỡng cuối:</span>
                <span className="text-sm text-gray-800">{vehicle.lastMaintenance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">🛡️ Bảo hiểm:</span>
                <span className="text-sm text-gray-800">{vehicle.insurance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">📊 Trạng thái:</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  vehicle.status === 'Hoạt động tốt' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {vehicle.status}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">📈 Thống kê sử dụng</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Km/ngày:</span>
                  <span>{Math.round(vehicle.totalKm / 30)} km</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Hiệu suất:</span>
                  <span className="text-green-600">Tốt</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Lần sạc:</span>
                  <span>{Math.round(vehicle.totalKm / 300)} lần</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">🔧 Lịch sử bảo dưỡng</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Tháng 1:</span>
                  <span className="text-green-600">✓ Hoàn thành</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Tháng 2:</span>
                  <span className="text-yellow-600">⏳ Đang chờ</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Tháng 3:</span>
                  <span className="text-gray-400">- Chưa lên lịch</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Tổng quan xe</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{MOCK_VEHICLES.length}</div>
            <div className="text-sm text-gray-600">Tổng số xe</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(MOCK_VEHICLES.reduce((sum, v) => sum + v.batteryLevel, 0) / MOCK_VEHICLES.length)}%</div>
            <div className="text-sm text-gray-600">Pin trung bình</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{MOCK_VEHICLES.reduce((sum, v) => sum + v.totalKm, 0).toLocaleString()} km</div>
            <div className="text-sm text-gray-600">Tổng km</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{MOCK_VEHICLES.filter(v => v.status === 'Hoạt động tốt').length}</div>
            <div className="text-sm text-gray-600">Xe hoạt động tốt</div>
          </div>
        </div>
      </div>
    </div>
  );
}
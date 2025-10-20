import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const MOCK_MEMBERS = [
  { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@email.com", phone: "0123456789", joinDate: "2024-01-15", usageHours: 120, totalKm: 2500 },
  { id: 2, name: "Trần Thị B", email: "tranthib@email.com", phone: "0987654321", joinDate: "2024-01-20", usageHours: 95, totalKm: 1800 },
  { id: 3, name: "Lê Văn C", email: "levanc@email.com", phone: "0369258147", joinDate: "2024-02-01", usageHours: 80, totalKm: 1500 },
  { id: 4, name: "Phạm Thị D", email: "phamthid@email.com", phone: "0741852963", joinDate: "2024-02-10", usageHours: 60, totalKm: 1200 },
];

export default function MemberDetailPage() {
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
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Chi tiết thành viên nhóm {groupId}</h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_MEMBERS.map((member, index) => (
          <div key={member.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
              <p className="text-sm text-gray-600">{member.email}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">📞 Số điện thoại:</span>
                <span className="text-sm text-gray-800">{member.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">📅 Ngày tham gia:</span>
                <span className="text-sm text-gray-800">{member.joinDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">⏱️ Giờ sử dụng:</span>
                <span className="text-sm text-blue-600 font-semibold">{member.usageHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">🛣️ Tổng km:</span>
                <span className="text-sm text-green-600 font-semibold">{member.totalKm.toLocaleString()} km</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">📊 Thống kê sử dụng</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span>Trung bình/ngày:</span>
                  <span>{Math.round(member.usageHours / 30)}h</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Hiệu suất:</span>
                  <span className="text-green-600">Tốt</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">💰 Lịch sử thanh toán</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Tháng 1:</span>
                  <span className="text-green-600">✓ Đã thanh toán</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Tháng 2:</span>
                  <span className="text-green-600">✓ Đã thanh toán</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Tháng 3:</span>
                  <span className="text-yellow-600">⏳ Chờ thanh toán</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📈 Tổng quan nhóm</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{MOCK_MEMBERS.length}</div>
            <div className="text-sm text-gray-600">Tổng thành viên</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{MOCK_MEMBERS.reduce((sum, m) => sum + m.usageHours, 0)}h</div>
            <div className="text-sm text-gray-600">Tổng giờ sử dụng</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{MOCK_MEMBERS.reduce((sum, m) => sum + m.totalKm, 0).toLocaleString()} km</div>
            <div className="text-sm text-gray-600">Tổng km</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(MOCK_MEMBERS.reduce((sum, m) => sum + m.usageHours, 0) / MOCK_MEMBERS.length)}h</div>
            <div className="text-sm text-gray-600">Trung bình/người</div>
          </div>
        </div>
      </div>
    </div>
  );
}
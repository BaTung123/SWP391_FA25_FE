import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateOwnershipGroupPage from "./createOwnershipGroupPage";
import GroupDetailPage from "./groupDetailPage";
import { useNavigate, useLocation } from "react-router-dom";

const API_BASE = "http://40.82.145.164:8080/api";

// --- Quản lý nhóm ---
export default function ManageOwnershipGroups() {
  const [groups, setGroups] = useState([]);
  // const [selectedGroup, setSelectedGroup] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchGroups = () => {
    // setLoading(true);
    axios.get(`${API_BASE}/ownership-groups`)
      .then(res => setGroups(res.data || []))
      .catch(() => {
        // Mock data khi API không hoạt động
        setGroups([
          {
            id: "1760925701828",
            name: "Nhóm VinFast Premium",
            members: [
              { id: 1, name: "Nguyễn Văn A" },
              { id: 2, name: "Trần Thị B" },
              { id: 3, name: "Lê Văn C" },
              { id: 4, name: "Phạm Thị D" },
            ],
            cars: [{ id: 1, name: "VinFast VF e34" }],
            fund: { balance: 15000000, history: [] }
          },
          {
            id: "1760925522636",
            name: "Nhóm VinFast Standard",
            members: [
              { id: 1, name: "Nguyễn Văn A" },
              { id: 2, name: "Trần Thị B" },
            ],
            cars: [{ id: 1, name: "VinFast VF e34" }],
            fund: { balance: 10000000, history: [] }
          },
          {
            id: "1",
            name: "Nhóm Tesla",
            members: [
              { id: 1, name: "Nguyễn Văn A" },
              { id: 2, name: "Trần Thị B" },
            ],
            cars: [{ id: 2, name: "Tesla Model 3" }],
            fund: { balance: 12000000, history: [] }
          }
        ]);
      });
      // .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // const handleDeleteGroup = async (groupId) => {
  //   if (!window.confirm("Bạn chắc chắn muốn xóa nhóm này?")) return;
  //   setLoading(true);
  //   try {
  //     await axios.delete(`${API_BASE}/ownership-groups/${groupId}`);
  //     setGroups(prev => prev.filter(g => g.id !== groupId));
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   setLoading(false);
  // };

  // Hàm thêm nhóm mới vào danh sách
  const handleAddGroup = (newGroup) => {
    // Tạo id cho nhóm mock
    newGroup.id = Date.now();
    setGroups(prev => [...prev, newGroup]);
  };

  // Khi click chi tiết, chuyển sang trang quản lý nhóm
  const handleDetail = (group) => {
    navigate(`/staff/manage-ownership-groups/${group.id}`);
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700 text-center">Quản lý nhóm đồng sở hữu</h1>
        <button
          onClick={() => setShowCreateGroup(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Tạo nhóm
        </button>
      </div>
      <table className="min-w-full bg-white border rounded-lg overflow-hidden shadow">
        <thead>
          <tr className="bg-blue-50">
            <th className="py-3 px-4 text-left">Tên nhóm</th>
            <th className="py-3 px-4 text-left">Số thành viên</th>
            <th className="py-3 px-4 text-left">Số xe</th>
            <th className="py-3 px-4 text-left">Quỹ chung</th>
            <th className="py-3 px-4 text-left">Trạng thái AI</th>
            <th className="py-3 px-4 text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => (
            <tr key={group.id} className="border-b hover:bg-blue-50 transition">
              <td className="py-2 px-4 font-semibold">{group.name}</td>
              <td className="py-2 px-4">
                <div className="flex items-center">
                  <span className="mr-1">👥</span>
                  {group.members?.length || 0}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className="flex items-center">
                  <span className="mr-1">🚗</span>
                  {group.cars?.length || 0}
                </div>
              </td>
              <td className="py-2 px-4">
                <div className="flex items-center">
                  <span className="mr-1">💰</span>
                  {((group.fund?.balance || 10000000)).toLocaleString()} VNĐ
                </div>
              </td>
              <td className="py-2 px-4">
                <span className="flex items-center">
                  <span className="mr-1">🤖</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    Math.random() > 0.5 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {Math.random() > 0.5 ? "Đang phân tích" : "Cần cập nhật"}
                  </span>
                </span>
              </td>
              <td className="py-2 px-4 text-center">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-600"
                  onClick={() => handleDetail(group)}
                >
                  Chi tiết
                </button>
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  onClick={() => console.log("Export report for", group.name)}
                  title="Xuất báo cáo"
                >
                  📊
                </button>
              </td>
            </tr>
          ))}
          {groups.length === 0 && (
            <tr>
              <td colSpan={6} className="py-6 text-center text-gray-400">Không có nhóm nào.</td>
            </tr>
          )}
        </tbody>
      </table>
      {/* Popup tạo nhóm */}
      {showCreateGroup && (
        <CreateOwnershipGroupPage
          show={showCreateGroup}
          onClose={() => setShowCreateGroup(false)}
          onCreateGroup={handleAddGroup}
        />
      )}
    </div>
  );
}
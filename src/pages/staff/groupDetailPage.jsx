import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const MOCK_USERS = [
  { id: 1, name: "Nguyễn Văn A" },
  { id: 2, name: "Trần Thị B" },
  { id: 3, name: "Lê Văn C" },
  { id: 4, name: "Phạm Thị D" },
];
const MOCK_CARS = [
  { id: 1, name: "VinFast VF e34" },
  { id: 2, name: "Tesla Model 3" },
  { id: 3, name: "Hyundai Ioniq 5" },
  { id: 4, name: "Kia EV6" },
];

export default function GroupDetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const group = location.state?.group;

  // State cho các chức năng mock - phải khai báo trước early return
  const [members, setMembers] = useState([]);
  const [cars, setCars] = useState([]);
  const [roleMap, setRoleMap] = useState({});
  const [userSearch, setUserSearch] = useState("");
  const [carSearch, setCarSearch] = useState("");
  const [votes, setVotes] = useState([]);
  const [voteTitle, setVoteTitle] = useState("");
  const [voteDesc, setVoteDesc] = useState("");
  const [fund, setFund] = useState({ balance: 10000000, history: [] });
  const [showMembersPopup, setShowMembersPopup] = useState(false);
  const [showVehiclesPopup, setShowVehiclesPopup] = useState(false);

  // Mock data cho các nhóm
  const MOCK_GROUPS = [
    {
      id: "1760925701828",
      name: "Nhóm VinFast Premium",
      members: [...MOCK_USERS],
      cars: [MOCK_CARS[0]],
      fund: { balance: 15000000, history: [] }
    },
    {
      id: "1760925522636",
      name: "Nhóm VinFast Standard",
      members: [...MOCK_USERS],
      cars: [MOCK_CARS[0]],
      fund: { balance: 10000000, history: [] }
    },
    {
      id: "1",
      name: "Nhóm VinFast",
      members: [...MOCK_USERS],
      cars: [MOCK_CARS[0]],
      fund: { balance: 10000000, history: [] }
    },
    {
      id: "2",
      name: "Nhóm Tesla",
      members: [MOCK_USERS[1], MOCK_USERS[2]],
      cars: [MOCK_CARS[1]],
      fund: { balance: 12000000, history: [] }
    },
  ];

  // Nếu không có dữ liệu nhóm từ state, tìm từ danh sách mock hoặc API
  let groupData = group;
  if (!groupData && id) {
    // Tìm nhóm từ mock data
    groupData = MOCK_GROUPS.find(g => String(g.id) === String(id));
    
    // Nếu vẫn không tìm thấy, tạo nhóm mặc định
    if (!groupData) {
      groupData = {
        id: id,
        name: `Nhóm ${id}`,
        members: [],
        cars: [],
        fund: { balance: 10000000, history: [] }
      };
    }
  }

  // Cập nhật state khi có groupData
  useEffect(() => {
    if (groupData) {
      setMembers(groupData.members || []);
      setCars(groupData.cars || []);
      setRoleMap(Object.fromEntries((groupData.members || []).map(m => [m.id, "member"])));
      setFund(groupData.fund || { balance: 10000000, history: [] });
    }
  }, [groupData]);

  if (!groupData) {
    navigate("/staff/manage-ownership-groups");
    return null;
  }

  // Thêm/xóa thành viên
  const filteredUsers = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) &&
      !members.some((m) => m.id === u.id)
  );
  const addMember = (user) => {
    setMembers([...members, user]);
    setRoleMap(prev => ({ ...prev, [user.id]: "member" }));
    setUserSearch("");
  };
  
  const removeMember = (id) => {
    setMembers(members.filter((m) => m.id !== id));
    setRoleMap(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  // Thêm/xóa xe
  const filteredCars = MOCK_CARS.filter(
    (c) =>
      c.name.toLowerCase().includes(carSearch.toLowerCase()) &&
      !cars.some((car) => car.id === c.id)
  );
  const addCar = (car) => {
    setCars([...cars, car]);
    setCarSearch("");
  };
  
  const removeCar = (id) => setCars(cars.filter((c) => c.id !== id));

  // Quỹ chung: thêm lịch sử chi tiêu (mock)
  const addFundHistory = (note, amount) => {
    setFund(prev => ({
      ...prev,
      balance: prev.balance - amount,
      history: [
        ...prev.history,
        { date: new Date().toLocaleDateString(), note, amount },
      ],
    }));
  };

  // Bỏ phiếu
  const createVote = () => {
    if (!voteTitle) return;
    setVotes(prev => [
      ...prev,
      { title: voteTitle, description: voteDesc, status: "Đang bỏ phiếu" },
    ]);
    setVoteTitle("");
    setVoteDesc("");
  };

  // Component popup hiển thị thành viên
  const MembersPopup = () => {
    if (!showMembersPopup) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn border border-gray-100">
          <button
            className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110"
            onClick={() => setShowMembersPopup(false)}
          >
            ×
          </button>
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              👥 Danh sách thành viên
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>

          <div className="mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{members.length}</div>
                <div className="text-sm text-gray-600">Tổng số thành viên</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {members.map((member, index) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{member.name}</div>
                    <div className="text-sm text-gray-600">
                      {roleMap[member.id] === "admin" ? "👑 Admin" : "👤 Thành viên"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">
                    ID: {member.id}
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc chắn muốn xóa thành viên "${member.name}"?`)) {
                        removeMember(member.id);
                      }
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 text-xs"
                    title="Xóa thành viên"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowMembersPopup(false)}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg transition-all duration-200 hover:scale-105"
            >
              Đóng
            </button>
          </div>
        </div>
        
        <style>
          {`
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-out;
            }
            @keyframes fadeIn {
              from { 
                opacity: 0; 
                transform: translateY(-20px) scale(0.95);
              }
              to { 
                opacity: 1; 
                transform: translateY(0) scale(1);
              }
            }
          `}
        </style>
      </div>
    );
  };

  // Component popup hiển thị xe
  const VehiclesPopup = () => {
    if (!showVehiclesPopup) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-fadeIn border border-gray-100">
          <button
            className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500 transition-all duration-200 hover:scale-110"
            onClick={() => setShowVehiclesPopup(false)}
          >
            ×
          </button>
          
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              🚗 Danh sách xe
            </h3>
            <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          </div>

          <div className="mb-4">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1">{cars.length}</div>
                <div className="text-sm text-gray-600">Tổng số xe</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cars.map((car) => (
              <div key={car.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                    🚗
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{car.name}</div>
                    <div className="text-sm text-gray-600">Xe điện</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">
                    ID: {car.id}
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc chắn muốn xóa xe "${car.name}"?`)) {
                        removeCar(car.id);
                      }
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 text-xs"
                    title="Xóa xe"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowVehiclesPopup(false)}
              className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 font-medium shadow-lg transition-all duration-200 hover:scale-105"
            >
              Đóng
            </button>
          </div>
        </div>
        
        <style>
          {`
            .animate-fadeIn {
              animation: fadeIn 0.3s ease-out;
            }
            @keyframes fadeIn {
              from { 
                opacity: 0; 
                transform: translateY(-20px) scale(0.95);
              }
              to { 
                opacity: 1; 
                transform: translateY(0) scale(1);
              }
            }
          `}
        </style>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded shadow">
      <button
        className="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        onClick={() => navigate("/staff/manage-ownership-groups")}
      >
        ← Quay lại
      </button>
      <h2 className="text-2xl font-bold mb-4 text-blue-700 text-center">Quản lý nhóm: {groupData.name}</h2>

      {/* Quản lý thành viên & phân quyền */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold text-gray-700">Thành viên & phân quyền</label>
          <button
            onClick={() => setShowMembersPopup(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium shadow-lg transition-all duration-200 hover:scale-105 flex items-center"
          >
            👥 Xem thành viên
          </button>
        </div>
        <input
          className="w-full border rounded px-3 py-2 mt-1 mb-2"
          placeholder="Tìm kiếm thành viên để thêm..."
          value={userSearch}
          onChange={(e) => setUserSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {userSearch.trim() !== "" &&
            filteredUsers.map((u) => (
              <button
                key={u.id}
                className="px-2 py-1 bg-gray-100 rounded-full hover:bg-blue-200 text-sm transition"
                onClick={() => addMember(u)}
              >
                {u.name} +
              </button>
            ))}
        </div>
      </div>

      {/* Quản lý xe */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="font-semibold text-gray-700">Xe trong nhóm</label>
          <button
            onClick={() => setShowVehiclesPopup(true)}
            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 font-medium shadow-lg transition-all duration-200 hover:scale-105 flex items-center"
          >
            🚗 Xem xe
          </button>
        </div>
        <input
          className="w-full border rounded px-3 py-2 mt-1 mb-2"
          placeholder="Tìm kiếm xe để thêm..."
          value={carSearch}
          onChange={(e) => setCarSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          {carSearch.trim() !== "" &&
            filteredCars.map((c) => (
              <button
                key={c.id}
                className="px-2 py-1 bg-gray-100 rounded-full hover:bg-green-200 text-sm transition"
                onClick={() => addCar(c)}
              >
                {c.name} +
              </button>
            ))}
        </div>
      </div>

      {/* Quỹ chung */}
      <div className="mb-6">
        <label className="font-semibold text-gray-700">Quỹ chung</label>
        <div className="mb-2">
          <span className="font-bold text-green-700">Số dư: {fund.balance?.toLocaleString()} VNĐ</span>
        </div>
        <div className="flex gap-2 mb-2">
          <input
            className="border rounded px-2 py-1"
            placeholder="Nội dung chi"
            id="fund-note"
          />
          <input
            className="border rounded px-2 py-1"
            placeholder="Số tiền"
            id="fund-amount"
            type="number"
            min={0}
          />
          <button
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => {
              const note = document.getElementById("fund-note").value;
              const amount = Number(document.getElementById("fund-amount").value);
              if (note && amount > 0 && amount <= fund.balance) {
                addFundHistory(note, amount);
                document.getElementById("fund-note").value = "";
                document.getElementById("fund-amount").value = "";
              }
            }}
          >
            Chi quỹ
          </button>
        </div>
        <div className="max-h-32 overflow-y-auto border rounded p-2 bg-gray-50">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left">Ngày</th>
                <th className="text-left">Nội dung</th>
                <th className="text-right">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {fund.history?.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.date}</td>
                  <td>{item.note}</td>
                  <td className="text-right">{item.amount?.toLocaleString()} VNĐ</td>
                </tr>
              ))}
              {(!fund.history || fund.history.length === 0) && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400">Chưa có giao dịch</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bỏ phiếu / quyết định chung */}
      <div className="mb-6">
        <label className="font-semibold text-gray-700">Bỏ phiếu / Quyết định chung</label>
        <div className="mb-2">
          <input
            className="border rounded px-2 py-1 mr-2"
            placeholder="Tiêu đề bỏ phiếu"
            value={voteTitle}
            onChange={e => setVoteTitle(e.target.value)}
          />
          <input
            className="border rounded px-2 py-1 mr-2"
            placeholder="Mô tả"
            value={voteDesc}
            onChange={e => setVoteDesc(e.target.value)}
          />
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={createVote}
            disabled={!voteTitle}
          >
            Tạo bỏ phiếu
          </button>
        </div>
        <div className="max-h-32 overflow-y-auto border rounded p-2 bg-gray-50">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left">Tiêu đề</th>
                <th className="text-left">Mô tả</th>
                <th className="text-left">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {votes.map((v, idx) => (
                <tr key={idx}>
                  <td>{v.title}</td>
                  <td>{v.description}</td>
                  <td>{v.status}</td>
                </tr>
              ))}
              {votes.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center text-gray-400">Chưa có bỏ phiếu nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Render popups */}
      <MembersPopup />
      <VehiclesPopup />
    </div>
  );
}
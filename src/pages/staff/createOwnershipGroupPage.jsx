import React, { useState, useEffect } from "react";
import axios from "axios";


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

const CreateOwnershipGroupPage = ({ show, onClose, onCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [cars, setCars] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [carSearch, setCarSearch] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dùng mock data để test
  useEffect(() => {
    setAllUsers(MOCK_USERS);
    setAllCars(MOCK_CARS);
  }, []);

  // Lọc user và xe theo từ khóa
  const filteredUsers = allUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) &&
      !members.some((m) => m.id === u.id)
  );
  const filteredCars = allCars.filter(
    (c) =>
      c.name?.toLowerCase().includes(carSearch.toLowerCase()) &&
      !cars.some((car) => car.id === c.id)
  );

  // Thêm/xóa thành viên
  const addMember = (user) => {
    setMembers([...members, user]);
    setUserSearch(""); // reset ô tìm kiếm sau khi chọn
  };
  const removeMember = (id) => setMembers(members.filter((m) => m.id !== id));

  // Thêm/xóa xe
  const addCar = (car) => {
    setCars([...cars, car]);
    setCarSearch(""); // reset ô tìm kiếm sau khi chọn
  };
  const removeCar = (id) => setCars(cars.filter((c) => c.id !== id));

  // Tạo nhóm (mock API)
  const handleCreate = async () => {
    setLoading(true);
    try {
      // Tạo nhóm mới (mock)
      const newGroup = {
        name: groupName,
        members,
        cars,
      };
      if (onCreateGroup) onCreateGroup(newGroup); // Thêm nhóm vào danh sách
      alert("Tạo nhóm thành công!");
      setGroupName("");
      setMembers([]);
      setCars([]);
      if (onClose) onClose();
    } catch {
      alert("Tạo nhóm thất bại!");
    }
    setLoading(false);
  };

  if (show === false) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 relative animate-fadeIn">
        {onClose && (
          <button
            className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-red-500"
            onClick={onClose}
          >
            ×
          </button>
        )}
        <h2 className="text-2xl font-bold mb-6 text-blue-700 text-center">
          Tạo nhóm đồng sở hữu
        </h2>
        <input
          className="w-full border border-blue-200 rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Tên nhóm"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        {/* Thành viên */}
        <div className="mb-4">
          <label className="font-semibold">Thành viên</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1 mb-2"
            placeholder="Tìm kiếm thành viên..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 mb-2">
            {members.map((m) => (
              <span
                key={m.id}
                className="bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center"
              >
                {m.name}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => removeMember(m.id)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div>
            {userSearch.trim() !== "" &&
              filteredUsers.length > 0 &&
              filteredUsers.map((u) => (
                <button
                  key={u.id}
                  className="mr-2 mb-1 px-2 py-1 bg-gray-200 rounded hover:bg-blue-200"
                  onClick={() => addMember(u)}
                >
                  {u.name} +
                </button>
              ))}
            {userSearch.trim() !== "" && filteredUsers.length === 0 && (
              <div className="text-gray-400 text-sm">
                Không tìm thấy thành viên
              </div>
            )}
          </div>
        </div>

        {/* Xe */}
        <div className="mb-4">
          <label className="font-semibold">Xe</label>
          <input
            className="w-full border rounded px-3 py-2 mt-1 mb-2"
            placeholder="Tìm kiếm xe..."
            value={carSearch}
            onChange={(e) => setCarSearch(e.target.value)}
          />
          <div className="flex flex-wrap gap-2 mb-2">
            {cars.map((c) => (
              <span
                key={c.id}
                className="bg-green-100 text-green-700 px-2 py-1 rounded flex items-center"
              >
                {c.name}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => removeCar(c.id)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div>
            {carSearch.trim() !== "" &&
              filteredCars.length > 0 &&
              filteredCars.map((c) => (
                <button
                  key={c.id}
                  className="mr-2 mb-1 px-2 py-1 bg-gray-200 rounded hover:bg-green-200"
                  onClick={() => addCar(c)}
                >
                  {c.name} +
                </button>
              ))}
            {carSearch.trim() !== "" && filteredCars.length === 0 && (
              <div className="text-gray-400 text-sm">Không tìm thấy xe</div>
            )}
          </div>
        </div>

        <button
          className={`bg-blue-600 text-white px-6 py-2 rounded-lg w-full font-semibold shadow hover:bg-blue-700 transition ${
            loading || !groupName || members.length === 0 || cars.length === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          onClick={handleCreate}
          disabled={loading || !groupName || members.length === 0 || cars.length === 0}
        >
          {loading ? "Đang tạo nhóm..." : "Tạo nhóm"}
        </button>
      </div>
      {/* Hiệu ứng fadeIn cho modal */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.25s;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(40px);}
            to { opacity: 1; transform: none;}
          }
        `}
      </style>
    </div>
  );
};

export default CreateOwnershipGroupPage;
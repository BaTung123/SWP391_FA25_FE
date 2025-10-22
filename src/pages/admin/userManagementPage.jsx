import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "../../config/axios";

const roleLabel = (roleNumber) => (roleNumber === 1 ? "Nhân viên" : "Thành viên");
const statusLabel = (deleteAt) => (deleteAt ? "Ngừng hoạt động" : "Hoạt động");

export default function UserManagementPage() {
  const [usersRaw, setUsersRaw] = useState([]);     // dữ liệu gốc từ API
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // Modal thêm người dùng (giữ nguyên UI, hiện chưa gọi API tạo mới)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Pagination (giữ nguyên)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Gọi API lấy danh sách user
  const fetchUsers = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const res = await api.get("/User");
      const list = Array.isArray(res.data) ? res.data : [res.data];

      // Map về cấu trúc hiển thị
      const mapped = list.map((u) => ({
        id: u.userId ?? u.id ?? 0,
        name: u.fullName ?? u.userName ?? "",
        email: u.email ?? "",
        roleNumber: typeof u.role === "number" ? u.role : Number(u.role ?? 0),
        roleText:
          typeof u.role === "number" ? roleLabel(u.role) : roleLabel(Number(u.role ?? 0)),
        statusText: statusLabel(u.deleteAt),
        deleteAt: u.deleteAt ?? null,
        raw: u,
      }));

      setUsersRaw(mapped);
      setCurrentPage(1);
    } catch (e) {
      console.error("Fetch /User error:", e?.response?.data || e?.message);
      setErrMsg("Không tải được danh sách người dùng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tính toán phân trang trên mảng đã map
  const totalPages = useMemo(
    () => Math.ceil(usersRaw.length / itemsPerPage) || 1,
    [usersRaw.length, itemsPerPage]
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = useMemo(
    () => usersRaw.slice(startIndex, endIndex),
    [usersRaw, startIndex, endIndex]
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    return status === "Hoạt động" ? (
      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        Hoạt động
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
        Ngừng hoạt động
      </span>
    );
  };

  // Toggle trạng thái: hiện tại đổi local hiển thị (nếu muốn call API, mình thêm sau)
  const toggleUserStatus = (userId) => {
    setUsersRaw((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              statusText: u.statusText === "Hoạt động" ? "Ngừng hoạt động" : "Hoạt động",
            }
          : u
      )
    );
  };

  // Modal thêm người dùng (hiện vẫn thêm local; nếu muốn gọi API: POST /User/register)
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.password) return;

    const nextId =
      usersRaw.length > 0 ? Math.max(...usersRaw.map((u) => Number(u.id))) + 1 : 1;
    const row = {
      id: nextId,
      name: newUser.name,
      email: newUser.email,
      roleNumber: 1,
      roleText: "Nhân viên",
      statusText: "Hoạt động",
      deleteAt: null,
      raw: null,
    };

    setUsersRaw((prev) => [...prev, row]);
    setNewUser({ name: "", email: "", password: "" });
    setIsModalOpen(false);

    // TODO (nếu cần): gọi api.post("/User/register", { userName, fullName, email, password, role: 1 }).then(fetchUsers)
  };

  const handleInputChange = (e) => {
    setNewUser((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FaPlus className="w-4 h-4 mr-2" />
            Thêm thành viên
          </button>
        </div>
      </div>

      {/* Thông báo lỗi */}
      {errMsg && (
        <div className="p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
          {errMsg}
        </div>
      )}

      {/* Bảng danh sách người dùng */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Tên người dùng
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors text-center">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{u.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{u.roleText}</td>
                  <td className="px-6 py-4">{getStatusBadge(u.statusText)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-indigo-500 ${
                        u.statusText === "Hoạt động" ? "bg-indigo-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          u.statusText === "Hoạt động" ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && currentUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    Không có người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 border text-sm font-medium ${
                page === currentPage
                  ? "bg-indigo-50 border-indigo-500 text-indigo-600"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
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

      {/* Modal thêm người dùng (hiện thêm local) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Thêm nhân viên mới</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-left"
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-left"
                  placeholder="Nhập địa chỉ email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 text-left"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

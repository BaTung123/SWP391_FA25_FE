import React, { useState, useMemo } from "react";
import {
  FaCreditCard,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaSearch,
  FaEdit,
} from "react-icons/fa";
import api from "../../config/axios";

const VotePage = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      vehicle: { name: "Toyota Camry 2023", license: "ABC-123" },
      serviceType: "Sửa động cơ",
      status: "Đã đánh giá",
      date: "2024-02-14",
      coOwners: [
        { name: "Nguyễn Văn A", paid: true },
        { name: "Trần Thị B", paid: false },
        { name: "Lê Văn C", paid: true },
      ],
    },
    {
      id: 2,
      vehicle: { name: "Honda Civic 2023", license: "XYZ-789" },
      serviceType: "Bảo dưỡng định kỳ",
      status: "Chờ đánh giá",
      date: "2024-02-15",
      coOwners: [
        { name: "Phạm Minh D", paid: false },
        { name: "Vũ Thị E", paid: false },
      ],
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 5;

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return payments.filter((p) => {
      const matchKW =
        !kw ||
        [p?.vehicle?.name, p?.vehicle?.license, p?.serviceType]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(kw));

      const matchStatus =
        statusFilter === "all" ? true : p.status === statusFilter;

      return matchKW && matchStatus;
    });
  }, [payments, keyword, statusFilter]);

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const currentPayments = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    (currentPage - 1) * itemsPerPage + itemsPerPage
  );

  const getStatusBadge = (status) => {
    const statusClasses = {
      "Đã đánh giá": "bg-green-100 text-green-800",
      "Chờ đánh giá": "bg-yellow-100 text-yellow-800",
    };
    return (
      <span
        className={`px-2 py-1 text-xs rounded-full font-semibold ${statusClasses[status]}`}
      >
        {status}
      </span>
    );
  };

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editServicePayment, setEditServicePayment] = useState(null);
  const [editedServiceType, setEditedServiceType] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState({
    groupId: "",
    formTitle: "",
    startDate: "",
    endDate: "",
  });

  const openEditModal = (payment) => {
    setEditServicePayment(payment);
    setEditedServiceType(payment.serviceType);
  };

  const saveServiceType = () => {
    setPayments((prev) =>
      prev.map((p) =>
        p.id === editServicePayment.id
          ? { ...p, serviceType: editedServiceType }
          : p
      )
    );
    setEditServicePayment(null);
  };

  const handleCreateForm = async () => {
    if (!newForm.groupId || !newForm.formTitle || !newForm.startDate || !newForm.endDate) {
      alert("Vui lòng nhập đầy đủ thông tin biểu mẫu.");
      return;
    }
    setCreating(true);
    try {
      await api.post("/Form", {
        groupId: Number(newForm.groupId),
        formTitle: newForm.formTitle.trim(),
        startDate: new Date(newForm.startDate).toISOString(),
        endDate: new Date(newForm.endDate).toISOString(),
      });
      alert("Tạo biểu mẫu đánh giá thành công!");
      setIsCreateOpen(false);
      setNewForm({ groupId: "", formTitle: "", startDate: "", endDate: "" });
    } catch (e) {
      alert("Không thể tạo biểu mẫu. Vui lòng thử lại.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaCreditCard className="text-gray-600" />
            <span className="font-semibold text-gray-900">Quản lý đánh giá</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">

<div className="relative" style={{ width: 260 }}>
  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
  <input
    type="text"
    placeholder="Tìm theo xe hoặc loại dịch vụ"
    value={keyword}
    onChange={(e) => {
      setKeyword(e.target.value);
      setCurrentPage(1);
    }}
    className="w-full pl-8 pr-8 py-1.5 h-8 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
  />
  {keyword && (
    <button
      onClick={() => {
        setKeyword("");
        setCurrentPage(1);
      }}
      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      <FaTimes className="w-3 h-3" />
    </button>
  )}
</div>

<select
  value={statusFilter}
  onChange={(e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  }}
  className="px-3 py-1.5 h-8 text-sm rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
  style={{ width: 180 }}
>
  <option value="all">Tất cả trạng thái</option>
  <option value="Đã đánh giá">Đã đánh giá</option>
  <option value="Chờ đánh giá">Chờ đánh giá</option>
</select>

<button
  onClick={() => setIsCreateOpen(true)}
  className="bg-blue-600 text-white px-4 py-1.5 h-8 text-sm rounded-md hover:bg-blue-700 whitespace-nowrap"
>
  Tạo biểu mẫu đánh giá
</button>

          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Xe", "Dịch vụ", "Trạng thái", "Ngày", "Thao tác"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="bg-white">
              {currentPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-center">
                    <div className="font-medium text-gray-900">
                      {payment.vehicle.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.vehicle.license}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">
                    {payment.serviceType}
                  </td>
                  <td className="px-6 py-4 text-center">{getStatusBadge(payment.status)}</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-900">{payment.date}</td>
                  <td className="px-6 py-4 text-center flex items-center justify-center gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 p-1"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <FaEye />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-800 p-1"
                      onClick={() => openEditModal(payment)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center py-4">
        <nav className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-2 py-2 rounded-l-md bg-white text-gray-500 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 text-sm ${
                  currentPage === page
                    ? "bg-indigo-50 text-indigo-600"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2 py-2 rounded-r-md bg-white text-gray-500 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </nav>
      </div>

      {/* Modal View */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Đồng sở hữu xe - {selectedPayment.vehicle.name}
              </h3>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-2 text-left">
              {selectedPayment.coOwners.map((co, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center px-3 py-2 rounded-md text-left"
                >
                  <span>{co.name}</span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      co.paid
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {co.paid ? "Đã vote" : "Chưa vote"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Service */}
      {editServicePayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Sửa loại dịch vụ - {editServicePayment.vehicle.name}
              </h3>
              <button
                onClick={() => setEditServicePayment(null)}
                className="text-gray-600 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>

      <input
        type="text"
        value={editedServiceType}
        onChange={(e) => setEditedServiceType(e.target.value)}
        className="w-full px-3 py-2 rounded-md mt-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-left"
      />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={saveServiceType}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create Form */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg text-left">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Tạo biểu mẫu đánh giá</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-gray-600 hover:text-gray-800">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nhóm</label>
                <input
                  type="number"
                  value={newForm.groupId}
                  onChange={(e) => setNewForm({ ...newForm, groupId: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-left"
                  placeholder="Chọn nhóm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phần sửa chữa</label>
                <input
                  type="text"
                  value={newForm.formTitle}
                  onChange={(e) => setNewForm({ ...newForm, formTitle: e.target.value })}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-left"
                  placeholder="VD: Đánh giá sửa chữa"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                  <input
                    type="datetime-local"
                    value={newForm.startDate}
                    onChange={(e) => setNewForm({ ...newForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-left"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                  <input
                    type="datetime-local"
                    value={newForm.endDate}
                    onChange={(e) => setNewForm({ ...newForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-left"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateForm}
                disabled={creating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
              >
                {creating ? 'Đang tạo...' : 'Tạo biểu mẫu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotePage;

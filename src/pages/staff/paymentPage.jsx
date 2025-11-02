import React, { useState, useMemo } from "react";
import {
  FaCreditCard,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaSearch,
} from "react-icons/fa";

const PaymentPage = () => {
  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  const [payments] = useState([
    {
      id: 1,
      paymentId: "#PAY001",
      vehicle: { name: "Toyota Camry 2023", license: "ABC-123" },
      serviceType: "Sửa động cơ",
      amount: 11500000,
      status: "Đã thanh toán",
      date: "2024-02-14",
      coOwners: [
        { name: "Nguyễn Văn A", paid: true },
        { name: "Trần Thị B", paid: false },
        { name: "Lê Văn C", paid: true },
      ],
    },
    {
      id: 2,
      paymentId: "#PAY002",
      vehicle: { name: "Honda Civic 2023", license: "XYZ-789" },
      serviceType: "Bảo dưỡng định kỳ",
      amount: 3000000,
      status: "Chờ thanh toán",
      date: "2024-02-15",
      coOwners: [
        { name: "Phạm Minh D", paid: false },
        { name: "Vũ Thị E", paid: false },
      ],
    },
  ]);

  // Filter and Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 5;

  // --- Lọc + tìm kiếm ---
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return payments.filter((p) => {
      const matchKW =
        !kw ||
        [
          p?.paymentId,
          p?.vehicle?.name,
          p?.vehicle?.license,
          p?.serviceType,
          formatCurrency(p?.amount),
        ]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(kw));

      const matchStatus =
        statusFilter === "all" ? true : p.status === statusFilter;

      return matchKW && matchStatus;
    });
  }, [payments, keyword, statusFilter]);

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filtered.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      "Đã thanh toán": "bg-green-100 text-green-800",
      "Chờ thanh toán": "bg-yellow-100 text-yellow-800",
    };
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[status]}`}
      >
        {status}
      </span>
    );
  };

  // Modal state
  const [selectedPayment, setSelectedPayment] = useState(null);

  return (
    <div className="space-y-4">
      {/* Header + Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Title */}
          <div className="flex items-center gap-2">
            <FaCreditCard className="text-gray-600" />
            <span className="font-semibold text-gray-900">Quản lý thanh toán</span>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative" style={{ width: 260 }}>
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Tìm theo mã/ xe/ dịch vụ/ số tiền"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-8 py-1.5 h-8 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              {keyword && (
                <button
                  onClick={() => {
                    setKeyword("");
                    setCurrentPage(1);
                  }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  type="button"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 h-8 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              style={{ width: 180 }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="Đã thanh toán">Đã thanh toán</option>
              <option value="Chờ thanh toán">Chờ thanh toán</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Mã giao dịch",
                  "Xe",
                  "Dịch vụ",
                  "Số tiền",
                  "Trạng thái",
                  "Ngày",
                  "Thao tác",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 text-center">
                    {payment.paymentId}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.vehicle.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.vehicle.license}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-center">
                    {payment.serviceType}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 text-center">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 text-center">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="text-blue-600 hover:text-blue-900 p-1"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <FaEye />
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
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
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

      {/* Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Danh sách đồng sở hữu - {selectedPayment.vehicle.name}
              </h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Table inside modal */}
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    STT
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                    Tên chủ sở hữu
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedPayment.coOwners.map((owner, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 text-sm text-gray-700 text-left">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 text-left">
                      {owner.name}
                    </td>
                    <td className="px-4 py-2 text-sm text-center">
                      {owner.paid ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          Đã thanh toán
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                          Chưa thanh toán
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;

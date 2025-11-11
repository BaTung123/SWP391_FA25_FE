import React, { useState, useMemo, useEffect } from "react";
import {
  FaCreditCard,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import api from "../../config/axios";

const STATUS_MAP = {
  Pending: "Chờ thanh toán",
  Success: "Đã thanh toán",
  Paid: "Đã thanh toán",
  Completed: "Đã thanh toán",
  Failed: "Thất bại",
  Cancelled: "Đã hủy",
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("vi-VN");
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "—";
  const number = Number(amount);
  if (Number.isNaN(number)) return String(amount);
  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });
};

const safeNum = (v, fb = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};

const normalizePaymentRecord = (item) => {
  if (!item) return null;

  const status =
    typeof item.status === "string"
      ? STATUS_MAP[item.status] || item.status
      : "Chờ thanh toán";

  // Use amountVnd if available and > 0, otherwise use amount
  const amount = item.amountVnd && item.amountVnd > 0 ? item.amountVnd : item.amount;

  return {
    id: item.paymentId ?? item.id ?? Date.now(),
    paymentId: `#PAY${String(item.paymentId ?? item.id ?? "").padStart(6, "0")}`,
    userId: item.userId ?? item.user?.id ?? null,
    carId: item.carId ?? item.vehicleId ?? item.vehicle?.carId ?? item.vehicle?.id ?? null,
    vehicle: {
      name: item.carName ?? item.vehicle?.name ?? "Đang cập nhật",
      license: item.plateNumber ?? item.vehicle?.license ?? "Đang cập nhật",
    },
    serviceType: item.description ?? item.serviceType ?? "Khác",
    amount: amount ?? 0,
    status,
    date: formatDate(item.createdAt ?? item.date),
    orderId: item.orderId,
    paymentMethod: item.paymentMethod,
    currency: item.currency,
    coOwners: item.coOwners ?? [], // Empty array if not provided
  };
};

const PaymentPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Filter and Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const itemsPerPage = 5;

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const response = await api.get("/Payment");
        const data = response.data?.data ?? response.data ?? [];
        
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format");
        }

        const normalized = data
          .map(normalizePaymentRecord)
          .filter(Boolean);

        setPayments(normalized);
        setCurrentPage(1);
      } catch (error) {
        console.error("Failed to fetch payments", error);
        setErrorMessage(
          "Không thể tải danh sách thanh toán. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

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
      "Thất bại": "bg-red-100 text-red-800",
      "Đã hủy": "bg-gray-100 text-gray-800",
    };
    const badgeClass = statusClasses[status] ?? "bg-gray-100 text-gray-800";
    
    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}
      >
        {status}
      </span>
    );
  };

  // Modal state
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [carUsers, setCarUsers] = useState([]);
  const [loadingCarUsers, setLoadingCarUsers] = useState(false);

  // Fetch users by carId (similar to votePage)
  const fetchUsersByCarId = async (carId) => {
    if (!carId) return [];

    try {
      // Try direct API first - API returns list of carUser objects
      const res = await api.get(`/cars/${carId}/users`);
      const arr = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      if (arr.length > 0) {
        // If API returns userId directly, use it
        // Otherwise, we'll need to find userId from carUserId
        const result = [];
        for (const item of arr) {
          const carUserId = safeNum(item?.carUserId ?? item?.CarUserId, NaN);
          const userId = safeNum(item?.userId ?? item?.UserId ?? item?.user?.id ?? item?.user?.userId, NaN);
          
          // If userId is available, use it
          if (Number.isFinite(userId)) {
            result.push({ userId, carUserId });
          }
        }
        // If we got userIds, return them
        if (result.some((r) => Number.isFinite(r.userId))) {
          return result.filter((r) => Number.isFinite(r.userId));
        }
      }
    } catch {
      // Fallback: get all users and check
    }

    try {
      const ur = await api.get("/User");
      const users = Array.isArray(ur.data) ? ur.data : [];
      const result = [];

      const chunk = 8;
      for (let i = 0; i < users.length; i += chunk) {
        const batch = users.slice(i, i + chunk);
        const rs = await Promise.all(
          batch.map(async (u) => {
            const uid = safeNum(u?.id ?? u?.userId, NaN);
            if (!Number.isFinite(uid)) return null;
            try {
              const owned = await api.get(`/users/${uid}/cars`);
              const cars = Array.isArray(owned.data) ? owned.data : [];
              const match = cars.find(
                (c) => safeNum(c?.carId ?? c?.id ?? c?.car?.carId ?? c?.car?.id) === safeNum(carId)
              );
              if (match) {
                return {
                  userId: uid,
                  carUserId: safeNum(match?.carUserId ?? match?.CarUserId ?? match?.id, NaN),
                };
              }
              return null;
            } catch {
              return null;
            }
          })
        );
        rs.forEach((x) => x && result.push(x));
      }
      return result;
    } catch {
      return [];
    }
  };

  // Load car users when modal opens
  useEffect(() => {
    if (selectedPayment?.carId) {
      setLoadingCarUsers(true);
      fetchUsersByCarId(selectedPayment.carId).then((users) => {
        setCarUsers(users);
        setLoadingCarUsers(false);
      });
    } else {
      setCarUsers([]);
    }
  }, [selectedPayment?.carId]);

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
              <option value="Thất bại">Thất bại</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="text-center">
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
                  className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-sm text-gray-500 text-center"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}
              {!loading && currentPayments.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-sm text-gray-500 text-center"
                  >
                    {errorMessage || "Không có dữ liệu thanh toán."}
                  </td>
                </tr>
              )}
              {!loading &&
                currentPayments.map((payment) => (
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
                        title="Xem chi tiết"
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
                Chi tiết thanh toán
              </h2>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            {/* Payment Details */}
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Trạng thái
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(selectedPayment.status)}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                  Danh sách User ID theo Car ID
                </h4>
                {loadingCarUsers ? (
                  <div className="text-sm text-gray-500">Đang tải...</div>
                ) : carUsers.length === 0 ? (
                  <div className="text-sm text-gray-500">
                    {selectedPayment.carId 
                      ? "Không có dữ liệu user cho xe này."
                      : "Không có thông tin Car ID."}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {carUsers.map((u, index) => (
                      <div
                        key={u.userId ?? index}
                        className="flex items-center justify-between px-3 py-2 rounded-md border border-gray-100 bg-gray-50"
                      >
                        <span className="text-sm text-gray-800">
                          User ID: {u.userId}
                        </span>
                        {Number.isFinite(u.carUserId) && (
                          <span className="text-xs text-gray-500">
                            CarUser ID: {u.carUserId}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

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

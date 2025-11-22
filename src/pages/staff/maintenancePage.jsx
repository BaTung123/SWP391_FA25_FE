import React, { useState, useMemo, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaTools,
} from "react-icons/fa";
import api from "../../config/axios";

const STATUS_LABELS = {
  1: "Đã lên lịch",
  2: "Quá hạn",
  3: "Đang thực hiện",
  4: "Hoàn thành",
};

// Allowed options for selects in the edit modal
const TYPE_OPTIONS = ["Bảo dưỡng định kỳ", "Sửa chữa", "Kiểm định", "Khẩn cấp"];

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("vi-VN");
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === "") return "—";
  const number = Number(value);
  if (Number.isNaN(number)) return String(value);
  return number.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });
};

const getTodayInputDate = () => {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - tzOffset * 60000);
  return local.toISOString().split("T")[0];
};

const toUtcStartOfDayISOString = (dateStr) => {
  if (!dateStr) return new Date().toISOString();
  return new Date(dateStr + "T00:00:00Z").toISOString();
};

const toInputDateValue = (value) => {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
  } catch {
    // ignore parsing error
  }

  if (typeof value === "string" && value.includes("/")) {
    const [day, month, year] = value.split("/");
    if (day && month && year) {
      return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
    }
  }

  return "";
};

const isPastDate = (dateStr) => {
  if (!dateStr) return false;
  const today = getTodayInputDate();
  return dateStr < today;
};

const buildDefaultMaintenanceState = () => ({
  carId: "",
  type: "Bảo dưỡng định kỳ",
  scheduledDate: getTodayInputDate(),
  description: "",
  price: "",
  status: 1,
});

const normalizeMaintenanceRecord = (item) => {
  if (!item) return null;

  const status =
    typeof item.status === "string"
      ? item.status
      : STATUS_LABELS[item.status] ?? "Đang thực hiện";

  return {
    id: item.maintenanceId ?? item.id ?? Date.now(),
    maintenanceId: item.maintenanceId ?? item.id, // Store original ID for API calls
    carId: item.carId ?? item.car?.carId ?? item.car?.id,
    vehicle: {
      name:
        item.car?.carName ??
        item.vehicle?.name ??
        item.carName ??
        "Đang cập nhật",
      license:
        item.car?.plateNumber ??
        item.vehicle?.license ??
        item.plateNumber ??
        "Đang cập nhật",
    },
    type: item.maintenanceType ?? item.type ?? "Khác",
    scheduledDate: formatDate(item.maintenanceDay ?? item.scheduledDate),
    maintenanceDay: item.maintenanceDay ?? item.scheduledDate, // Store original date for editing
    status,
    description: item.description ?? "",
    statusCode: item.status,
    price: item.price ?? 0,
  };
};

const MaintenancePage = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [cars, setCars] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const itemsPerPage = 5;

  const [newMaintenance, setNewMaintenance] = useState(
    () => buildDefaultMaintenanceState()
  );

  const [editMaintenance, setEditMaintenance] = useState(
    () => buildDefaultMaintenanceState()
  );

  // Build car options and ensure current car appears first
  const editCarOptions = useMemo(() => {
    const toOption = (car) => {
      const id = car?.carId ?? car?.id;
      const name =
        car?.carName ?? car?.name ?? car?.brand ?? (id ? `Xe #${id}` : "Xe");
      const plate = car?.plateNumber ?? car?.licensePlate ?? "N/A";
      return {
        value: String(id ?? ""),
        label: `${name} - ${plate}`,
      };
    };

    const list = Array.isArray(cars) ? cars.map(toOption) : [];

    // If current car (from edit state) is not in fetched options, prepend it
    const currentId = String(editMaintenance.carId ?? "");
    const hasCurrent = currentId
      ? list.some((opt) => opt.value === currentId)
      : false;

    if (!hasCurrent && currentId) {
      const fallback = {
        value: currentId,
        label:
          (editingMaintenance?.vehicle?.name ?? "Xe") +
          " - " +
          (editingMaintenance?.vehicle?.license ?? "N/A"),
      };
      return [fallback, ...list];
    }

    return list;
  }, [cars, editMaintenance.carId, editingMaintenance]);

  // Refresh maintenance list
  const refreshMaintenanceList = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      const response = await api.get("/Maintenance");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data ?? [];

      const normalized = data
        .map(normalizeMaintenanceRecord)
        .filter(Boolean);

      setMaintenanceRecords(normalized);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to fetch maintenance records", error);
      setErrorMessage(
        "Không thể tải danh sách bảo dưỡng. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMaintenanceList();
  }, []);

  // Fetch cars for dropdown
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await api.get("/Car");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data ?? [];
        setCars(data);
      } catch (error) {
        console.error("Failed to fetch cars", error);
      }
    };

    fetchCars();
  }, []);

  // --- Lọc + tìm kiếm ---
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return maintenanceRecords.filter((r) => {
      const matchKW =
        !kw ||
        [
          r?.vehicle?.name,
          r?.vehicle?.license,
          r?.type,
          r?.description,
          r?.price,
        ]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(kw));

      const statusLabel =
        typeof r.status === "number"
          ? STATUS_LABELS[r.status] ?? String(r.status)
          : r.status;

      const matchStatus =
        statusFilter === "all" ? true : statusLabel === statusFilter;

      return matchKW && matchStatus;
    });
  }, [maintenanceRecords, keyword, statusFilter]);

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecords = filtered.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const handleAddMaintenance = async () => {
    if (
      !newMaintenance.carId ||
      !newMaintenance.description ||
      newMaintenance.price === ""
    ) {
      setModalError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      setModalLoading(true);
      setModalError("");

      const maintenanceDay = new Date().toISOString();

      // Prepare request body
      const requestBody = {
        carId: Number(newMaintenance.carId),
        maintenanceType: newMaintenance.type,
        maintenanceDay: maintenanceDay,
        status: 1, // Đã lên lịch
        description: newMaintenance.description,
        price: Number(newMaintenance.price) || 0,
      };

      // Make POST request
      await api.post("/Maintenance", requestBody);

      // Reset form
      setNewMaintenance(buildDefaultMaintenanceState());
      setModalError("");
      setIsModalOpen(false);

      // Refresh maintenance list
      await refreshMaintenanceList();
    } catch (error) {
      console.error("Failed to create maintenance record", error);
      setModalError(
        error.response?.data?.message ||
        "Không thể tạo lịch bảo dưỡng. Vui lòng thử lại sau."
      );
    } finally {
      setModalLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMaintenance({ ...newMaintenance, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e) => {
    setEditMaintenance({ ...editMaintenance, [e.target.name]: e.target.value });
  };

  // Open edit modal
  const handleEditClick = (record) => {
    // Normalize values to ensure selects show the current data
    const normalizedType = TYPE_OPTIONS.includes(record.type)
      ? record.type
      : "Bảo dưỡng định kỳ";
    const normalizedStatus =
      typeof record.statusCode === "number" && record.statusCode >= 0 && record.statusCode <= 3
        ? record.statusCode
        : 0;

    const inputDate =
      toInputDateValue(record.maintenanceDay) ||
      toInputDateValue(record.scheduledDate) ||
      getTodayInputDate();

    setEditMaintenance({
      carId: String(record.carId || ""),
      type: normalizedType,
      scheduledDate: inputDate,
      description: record.description || "",
      price: String(record.price || 0),
      status: normalizedStatus,
    });
    setEditingMaintenance(record);
    setModalError("");
    setIsEditModalOpen(true);
  };

  // Update maintenance
  const handleUpdateMaintenance = async () => {
    if (
      !editMaintenance.carId ||
      !editMaintenance.scheduledDate ||
      !editMaintenance.description ||
      editMaintenance.price === ""
    ) {
      setModalError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    

    if (!editingMaintenance?.maintenanceId) {
      setModalError("Không tìm thấy thông tin bảo dưỡng cần cập nhật.");
      return;
    }

    try {
      setModalLoading(true);
      setModalError("");

      const maintenanceDay =
        editingMaintenance?.maintenanceDay ??
        editingMaintenance?.scheduledDate ??
        new Date().toISOString();

      // Prepare request body
      const requestBody = {
        carId: Number(editMaintenance.carId),
        maintenanceType: editMaintenance.type,
        maintenanceDay: maintenanceDay,
        status: Number(editMaintenance.status),
        description: editMaintenance.description,
        price: Number(editMaintenance.price) || 0,
      };

      const maintenanceId = editingMaintenance.maintenanceId;

      // Make PUT request to update endpoint
      await api.put(`/Maintenance/${maintenanceId}/update`, requestBody);

      // Reset form
      setEditMaintenance(buildDefaultMaintenanceState());
      setEditingMaintenance(null);
      setModalError("");
      setIsEditModalOpen(false);

      // Refresh maintenance list
      await refreshMaintenanceList();
    } catch (error) {
      console.error("Failed to update maintenance record", error);
      setModalError(
        error.response?.data?.message ||
        "Không thể cập nhật lịch bảo dưỡng. Vui lòng thử lại sau."
      );
    } finally {
      setModalLoading(false);
    }
  };

  // Delete maintenance
  const handleDeleteMaintenance = async (record) => {
    if (!record?.maintenanceId) {
      setErrorMessage("Không tìm thấy thông tin bảo dưỡng cần xóa.");
      return;
    }

    try {
      setLoading(true);
      const maintenanceId = record.maintenanceId;

      // Make DELETE request - try multiple endpoints
      try {
        await api.delete(`/Maintenance/${maintenanceId}`);
      } catch (e) {
        // Fallback to delete endpoint
        await api.delete(`/Maintenance/${maintenanceId}/delete`);
      }

      setDeleteConfirm(null);

      // Refresh maintenance list
      await refreshMaintenanceList();
    } catch (error) {
      console.error("Failed to delete maintenance record", error);
      setErrorMessage(
        error.response?.data?.message ||
        "Không thể xóa lịch bảo dưỡng. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      "Đã lên lịch": "bg-yellow-100 text-yellow-800",
      "Đang thực hiện": "bg-blue-100 text-blue-800",
      "Hoàn thành": "bg-green-100 text-green-800",
      "Quá hạn": "bg-red-100 text-red-800",
    };

    const label = typeof status === "number" ? STATUS_LABELS[status] ?? status : status;
    const badgeClass =
      statusClasses[label] ?? "bg-gray-100 text-gray-800";

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}
      >
        {label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header + Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Title */}
          <div className="flex items-center gap-2">
            <FaTools className="text-gray-600" />
            <span className="font-semibold text-gray-900">Quản lý bảo dưỡng xe</span>
          </div>

          {/* Filters and Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative" style={{ width: 260 }}>
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Tìm theo tên xe/biển số/loại/mô tả"
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
              <option value="Đã lên lịch">Đã lên lịch</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Quá hạn">Quá hạn</option>
            </select>

            {/* Add Button */}
            <button
              onClick={() => {
                setModalError("");
                setNewMaintenance(buildDefaultMaintenanceState());
                setIsModalOpen(true);
              }}
              className="bg-blue-600 text-white px-4 py-1.5 h-8 text-sm rounded-md hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap transition-colors font-medium"
            >
              <FaPlus className="text-xs" />
              Lên lịch bảo dưỡng
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách bảo dưỡng */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xe
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại bảo dưỡng
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá tiền
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày thực hiện
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-medium">{record.vehicle.name}</div>
                    <div className="text-gray-500 text-sm">
                      Biển số: {record.vehicle.license}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {formatCurrency(record.price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {record.scheduledDate}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                  <td
                    className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs"
                    title={record.description}
                  >
                    {record.description}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditClick(record)}
                        className="text-blue-600 hover:text-blue-900 p-1 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(record)}
                        className="text-red-600 hover:text-red-900 p-1 transition-colors"
                        title="Xóa"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
              {!loading && currentRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-sm text-gray-500 text-center"
                  >
                    {errorMessage || "Không có dữ liệu bảo dưỡng."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Phân trang */}
      <div className="flex items-center justify-center py-4">
        <nav
          className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
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

      {/* Modal thêm mới */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Lên lịch bảo dưỡng
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setModalError("");
                  setNewMaintenance(buildDefaultMaintenanceState());
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {modalError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {modalError}
                </div>
              )}

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Chọn xe <span className="text-red-500">*</span>
                  </label>
                </div>
                <select
                  name="carId"
                  value={newMaintenance.carId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Chọn xe --</option>
                  {cars.map((car) => (
                  <option key={car.carId ?? car.id} value={String(car.carId ?? car.id)}>
                      {car.carName ?? car.name ?? car.brand ?? `Xe #${car.carId ?? car.id}`} - {car.plateNumber ?? car.licensePlate ?? "N/A"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Loại bảo dưỡng
                  </label>
                </div>
                <select
                  name="type"
                  value={newMaintenance.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Bảo dưỡng định kỳ">Bảo dưỡng định kỳ</option>
                  <option value="Sửa chữa">Sửa chữa</option>
                  <option value="Kiểm định">Kiểm định</option>
                  <option value="Khẩn cấp">Khẩn cấp</option>
                </select>
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Giá tiền (VND) <span className="text-red-500">*</span>
                  </label>
                </div>
                <input
                  type="number"
                  name="price"
                  min={0}
                  step="1000"
                  value={newMaintenance.price}
                  onChange={handleInputChange}
                  placeholder="Nhập giá tiền..."
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">Ngày giờ khởi tạo</label>
                </div>
                <div className="w-full px-3 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                  {new Date().toLocaleString("vi-VN")}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                </div>
                <textarea
                  name="description"
                  value={newMaintenance.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả chi tiết..."
                  rows={3}
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setModalError("");
                  setNewMaintenance({
                    carId: "",
                    type: "Bảo dưỡng định kỳ",
                    scheduledDate: "",
                    description: "",
                    price: "",
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                disabled={modalLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleAddMaintenance}
                disabled={modalLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {modalLoading ? "Đang xử lý..." : "Xác nhận lên lịch"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Chỉnh sửa lịch bảo dưỡng
              </h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setModalError("");
                  setEditMaintenance(buildDefaultMaintenanceState());
                  setEditingMaintenance(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {modalError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {modalError}
                </div>
              )}

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Xe hiện tại
                  </label>
                </div>
                <div className="mt-1 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                  {(editingMaintenance?.vehicle?.name ?? "Xe chưa xác định") +
                    " - " +
                    (editingMaintenance?.vehicle?.license ?? "N/A")}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Đổi xe (tuỳ chọn)
                  </label>
                </div>
                <select
                  name="carId"
                  value={editMaintenance.carId}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">-- Giữ nguyên xe hiện tại --</option>
                  {editCarOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Loại bảo dưỡng
                  </label>
                </div>
                <select
                  name="type"
                  value={editMaintenance.type}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Bảo dưỡng định kỳ">Bảo dưỡng định kỳ</option>
                  <option value="Sửa chữa">Sửa chữa</option>
                  <option value="Kiểm định">Kiểm định</option>
                  <option value="Khẩn cấp">Khẩn cấp</option>
                </select>
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Trạng thái <span className="text-red-500">*</span>
                  </label>
                </div>
                <select
                  name="status"
                  value={editMaintenance.status}
                  onChange={handleEditInputChange}
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value={0}>Đã lên lịch</option>
                  <option value={1}>Đang thực hiện</option>
                  <option value={2}>Hoàn thành</option>
                  <option value={3}>Quá hạn</option>
                </select>
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Giá tiền (VND) <span className="text-red-500">*</span>
                  </label>
                </div>
                <input
                  type="number"
                  name="price"
                  min={0}
                  step="1000"
                  value={editMaintenance.price}
                  onChange={handleEditInputChange}
                  placeholder="Nhập giá tiền..."
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">Ngày giờ khởi tạo</label>
                </div>
                <div className="w-full px-3 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
                  {(() => {
                    const v = editingMaintenance?.maintenanceDay ?? editMaintenance?.scheduledDate;
                    try {
                      return v ? new Date(v).toLocaleString("vi-VN") : "—";
                    } catch {
                      return String(v || "—");
                    }
                  })()}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-left">
                  <label className="text-sm text-gray-700">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                </div>
                <textarea
                  name="description"
                  value={editMaintenance.description}
                  onChange={handleEditInputChange}
                  placeholder="Nhập mô tả chi tiết..."
                  rows={3}
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={handleUpdateMaintenance}
                disabled={modalLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {modalLoading ? "Đang xử lý..." : "Cập nhật"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Xác nhận xóa
              </h2>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-700">
                Bạn có chắc chắn muốn xóa lịch bảo dưỡng này không?
              </p>
              {deleteConfirm.vehicle && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Hủy
              </button>
              <button
                onClick={() => handleDeleteMaintenance(deleteConfirm)}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenancePage;

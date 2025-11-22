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
  FaEye,
} from "react-icons/fa";
import api from "../../config/axios";

const STATUS_LABELS = {
  0: "Chờ thanh toán",
  1: "Đã thanh toán",
  2: "Thất bại",
  3: "Đã hủy",
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

const PaymentPage = () => {
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

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
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [ownerPaymentDetails, setOwnerPaymentDetails] = useState([]);
  const [ownerPaymentLoading, setOwnerPaymentLoading] = useState(false);
  const itemsPerPage = 5;

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        const res = await api.get("/Payment");
        const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        setPayments(data);
        setCurrentPage(1);
      } catch (e) {
        console.error("Failed to fetch payments", e);
        setErrorMessage("Không thể tải lịch sử thanh toán. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [newMaintenance, setNewMaintenance] = useState({
    carId: "",
    type: "Bảo dưỡng định kỳ",
    scheduledDate: "",
    description: "",
    price: "",
    status: 0,
  });

  const [editMaintenance, setEditMaintenance] = useState({
    carId: "",
    type: "Bảo dưỡng định kỳ",
    scheduledDate: "",
    description: "",
    price: "",
    status: 0,
  });

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
  const refreshMaintenanceList = async (checkPaymentStatus = true) => {
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

      // Check and update payment status for each maintenance record if enabled and users are loaded
      let updatedRecords = normalized;
      if (checkPaymentStatus && allUsers.length > 0) {
        updatedRecords = await Promise.all(
          normalized.map(async (record) => {
            const maintenanceId = record.maintenanceId ?? record.id;
            const carId = record.carId;
            
            if (!maintenanceId || !carId) {
              return record;
            }

            // Check payment status for all owners
            const newStatus = await checkAndUpdatePaymentStatus(maintenanceId, carId);
            
            // If status changed, update the record and backend
            if (newStatus !== null && newStatus !== record.statusCode) {
              try {
                
                // Update local record
                return {
                  ...record,
                  status: STATUS_LABELS[newStatus] ?? "Chờ thanh toán",
                  statusCode: newStatus,
                };
              } catch (updateError) {
                console.error(`Failed to update status for maintenance ${maintenanceId}:`, updateError);
                // Return original record if update fails
                return record;
              }
            }
            
            return record;
          })
        );
      }

      setMaintenanceRecords(updatedRecords);
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
    refreshMaintenanceList(false); // Initial load without payment check
  }, []);

  // Auto-check payment status when users are loaded and maintenance records exist
  useEffect(() => {
    if (allUsers.length > 0 && maintenanceRecords.length > 0) {
      // Refresh with payment status check
      refreshMaintenanceList(true);
    }
  }, [allUsers.length]); // Only trigger when users are loaded

  // Note: We don't auto-refresh modal on maintenanceRecords change to avoid infinite loops
  // Modal will refresh when user clicks the refresh button or reopens it

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

  // Fetch all users for ownership checking
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/User");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.data ?? [];
        setAllUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  // Helper function to get all user IDs that own a car
  const getOwnersByCarId = async (carId) => {
    if (!carId || !allUsers.length) return [];
    
    try {
      const ownerIds = [];
      const limit = 8;
      const chunks = [];
      for (let i = 0; i < allUsers.length; i += limit) {
        chunks.push(allUsers.slice(i, i + limit));
      }

      for (const batch of chunks) {
        const results = await Promise.all(
          batch.map(async (u) => {
            const uid = Number(u?.id ?? u?.userId ?? u?.Id);
            if (!Number.isFinite(uid)) return null;
            try {
              const r = await api.get(`/users/${uid}/cars`);
              const arr = Array.isArray(r.data) ? r.data : (r.data ? [r.data] : []);
              const has = arr.some((c) => Number(c?.carId ?? c?.id) === Number(carId));
              return has ? uid : null;
            } catch (error) {
              // Silently ignore 404 errors (user doesn't exist or has no cars)
              if (error?.response?.status !== 404) {
                console.debug(`Error fetching cars for user ${uid}:`, error);
              }
              return null;
            }
          })
        );
        results.forEach((uid) => {
          if (uid) ownerIds.push(uid);
        });
      }
      return ownerIds;
    } catch (error) {
      console.error("Error getting owners by carId:", error);
      return [];
    }
  };

  // Helper function to check if payment is paid/completed
const isPaymentPaid = (paymentStatus) => {
  if (paymentStatus === null || paymentStatus === undefined) return false;
  if (typeof paymentStatus === "number") {
    return Number(paymentStatus) === 1 || Number(paymentStatus) === 4;
  }
  const normalized = String(paymentStatus).trim().toLowerCase();
  return (
    normalized === "1" ||
    normalized === "4" ||
    normalized === "completed" ||
    normalized === "paid" ||
    normalized === "paided" ||
    normalized === "success" ||
    normalized === "đã thanh toán"
  );
};

  // Helper function to check payment status for all owners
const checkAndUpdatePaymentStatus = async (maintenanceId, carId) => {
  if (!maintenanceId || !carId) return null;

  try {
    // Get all owners of this car
    const ownerIds = await getOwnersByCarId(carId);
    if (ownerIds.length === 0) {
      return null;
    }

    // Query payments per owner via Payment/{userId}
    const ownerPaidMap = new Map();
    await Promise.all(
      ownerIds.map(async (ownerId) => {
        try {
          const resp = await api.get(`/Payment/${ownerId}`);
          const list = Array.isArray(resp.data) ? resp.data : resp.data?.data ?? [];
          const hasPaid = list.some((p) => {
            const pCarId = p.carId ?? p.car?.carId ?? p.car?.id;
            const pMaintenanceId = p.maintenanceId ?? p.MaintenanceId ?? p.maintenance?.id;
            const status = p.status ?? p.Status;
            return (
              Number(pCarId) === Number(carId) &&
              Number(pMaintenanceId) === Number(maintenanceId) &&
              isPaymentPaid(status)
            );
          });
          ownerPaidMap.set(Number(ownerId), hasPaid);
        } catch (e) {
          ownerPaidMap.set(Number(ownerId), false);
        }
      })
    );

    const allOwnersPaid = ownerIds.length > 0 && ownerIds.every((id) => ownerPaidMap.get(Number(id)));
    return allOwnersPaid ? 1 : 0;
  } catch (error) {
    console.error("Error checking payment status:", error);
    return null;
  }
};

  // --- Lọc + tìm kiếm (Payments) ---
  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return payments.filter((p) => {
      const method = String(p?.paymentMethod ?? "").trim().toLowerCase();
      if (!(method === "payos" || /pay\s*os/.test(method))) return false;
      const matchKW =
        !kw ||
        [
          p?.paymentId,
          p?.orderId,
          p?.carName,
          p?.plateNumber,
          p?.description,
          p?.paymentMethod,
        ]
          .filter(Boolean)
          .some((t) => String(t).toLowerCase().includes(kw));

      const paid = isPaymentPaid(p?.status);
      const matchStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "paid"
          ? paid
          : !paid;

      return matchKW && matchStatus;
    });
  }, [payments, keyword, statusFilter]);

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
      !newMaintenance.scheduledDate ||
      !newMaintenance.description ||
      newMaintenance.price === ""
    ) {
      setModalError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    try {
      setModalLoading(true);
      setModalError("");

      // Convert date to ISO string
      // Date input gives YYYY-MM-DD, we append time to ensure correct timezone handling
      const dateStr = newMaintenance.scheduledDate;
      const maintenanceDay = dateStr 
        ? new Date(dateStr + "T00:00:00").toISOString()
        : new Date().toISOString();

      // Prepare request body
      const requestBody = {
        carId: Number(newMaintenance.carId),
        maintenanceType: newMaintenance.type,
        maintenanceDay: maintenanceDay,
        status: 0,
        description: newMaintenance.description,
        price: Number(newMaintenance.price) || 0,
      };

      // Make POST request
      await api.post("/Maintenance", requestBody);

      // Reset form
      setNewMaintenance({
        carId: "",
        type: "Bảo dưỡng định kỳ",
        scheduledDate: "",
        description: "",
        price: "",
        status: 0,
      });
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

  // Convert date from ISO string to YYYY-MM-DD format for date input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  // Open edit modal
  const handleEditClick = (record) => {
    // Try to get the original date from maintenanceDay, fallback to creating from formatted date
    let dateForInput = "";
    if (record.maintenanceDay) {
      dateForInput = formatDateForInput(record.maintenanceDay);
    } else if (record.scheduledDate) {
      // If we only have formatted date, try to parse it back
      // This is a fallback - ideally maintenanceDay should always be available
      try {
        const parsed = new Date(record.scheduledDate.split('/').reverse().join('-'));
        if (!Number.isNaN(parsed.getTime())) {
          dateForInput = formatDateForInput(parsed.toISOString());
        }
      } catch {
        dateForInput = "";
      }
    }

    // Normalize values to ensure selects show the current data
    const normalizedType = TYPE_OPTIONS.includes(record.type)
      ? record.type
      : "Bảo dưỡng định kỳ";
    const normalizedStatus =
      typeof record.statusCode === "number" && record.statusCode >= 0 && record.statusCode <= 3
        ? record.statusCode
        : 0;

    setEditMaintenance({
      carId: String(record.carId || ""),
      type: normalizedType,
      scheduledDate: dateForInput,
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

      // Convert date to ISO string
      const dateStr = editMaintenance.scheduledDate;
      const maintenanceDay = dateStr
        ? new Date(dateStr + "T00:00:00").toISOString()
        : new Date().toISOString();

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
      setEditMaintenance({
        carId: "",
        type: "Bảo dưỡng định kỳ",
        scheduledDate: "",
        description: "",
        price: "",
        status: 0,
      });
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
      "Chờ thanh toán": "bg-yellow-100 text-yellow-800",
      "Đã thanh toán": "bg-blue-100 text-blue-800",
      "Thất bại": "bg-green-100 text-green-800",
      "Đã hủy": "bg-red-100 text-red-800",
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

  // Fetch owner payment details when modal opens
  const fetchOwnerPaymentDetails = async (maintenanceId, carId, forceRefresh = false) => {
    if (!maintenanceId || !carId) {
      setOwnerPaymentDetails([]);
      return;
    }

    setOwnerPaymentLoading(true);
    try {
      // Get all owners of this car
      const ownerIds = await getOwnersByCarId(carId);
      
      if (ownerIds.length === 0) {
        setOwnerPaymentDetails([]);
        setOwnerPaymentLoading(false);
        return;
      }

  // Build per-owner payment map via Payment/{userId}
  const ownerPaymentLists = await Promise.all(
    ownerIds.map(async (ownerId) => {
      try {
        const resp = await api.get(`/Payment/${ownerId}`);
        const list = Array.isArray(resp.data) ? resp.data : resp.data?.data ?? [];
        return { ownerId, list };
      } catch {
        return { ownerId, list: [] };
      }
    })
  );

      // Get user info and payment status for each owner
      const ownerDetails = await Promise.all(
        ownerIds.map(async (ownerId) => {
          try {
            // Get user info
            const userRes = await api.get(`/User/${ownerId}`);
            const userData = userRes?.data ?? {};
            const userName = userData.fullName ?? userData.name ?? userData.email ?? `User #${ownerId}`;

      // Locate paid payment for this owner
      const ownerEntry = ownerPaymentLists.find((x) => Number(x.ownerId) === Number(ownerId));
      const hasPaid = (ownerEntry?.list || []).some((p) => {
        const pCarId = p.carId ?? p.car?.carId ?? p.car?.id;
        const pMaintenanceId = p.maintenanceId ?? p.MaintenanceId ?? p.maintenance?.id;
        const status = p.status ?? p.Status;
        return (
          Number(pCarId) === Number(carId) &&
          Number(pMaintenanceId) === Number(maintenanceId) &&
          isPaymentPaid(status)
        );
      });

      const paymentStatus = hasPaid ? "Đã thanh toán" : "Chờ thanh toán";

            return {
              userId: ownerId,
              name: userName,
              paymentStatus,
            };
          } catch (error) {
            // Silently ignore 404 errors
            if (error?.response?.status !== 404) {
              console.debug(`Error fetching user ${ownerId}:`, error);
            }
            return {
              userId: ownerId,
              name: `User #${ownerId}`,
              paymentStatus: "Chờ thanh toán",
            };
          }
        })
      );

      setOwnerPaymentDetails(ownerDetails);

      // If all owners have paid, update maintenance status in backend and refresh list
      // Only do this when forceRefresh is true to avoid infinite loops
      if (forceRefresh) {
        const allPaid = ownerDetails.every(owner => owner.paymentStatus === "Đã thanh toán");
        if (allPaid) {
          // Check and update maintenance status
          const newStatus = await checkAndUpdatePaymentStatus(maintenanceId, carId);
          if (newStatus !== null && newStatus === 1) {
            // Find current record to check if status needs updating
            const currentRecord = maintenanceRecords.find(
              r => (r.maintenanceId ?? r.id) === maintenanceId
            );
            if (currentRecord && currentRecord.statusCode !== 1) {
              // Update backend
              try {
                await api.put(`/Maintenance/${maintenanceId}/update`, {
                  carId: Number(carId),
                  maintenanceType: currentRecord.type,
                  maintenanceDay: currentRecord.maintenanceDay || currentRecord.scheduledDate,
                  status: 1, // Đã thanh toán
                  description: currentRecord.description,
                  price: currentRecord.price || 0,
                });
                // Refresh maintenance list to update status in table
                await refreshMaintenanceList(true);
              } catch (updateError) {
                console.error(`Failed to update status for maintenance ${maintenanceId}:`, updateError);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching owner payment details:", error);
      setOwnerPaymentDetails([]);
    } finally {
      setOwnerPaymentLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header + Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Title */}
          <div className="flex items-center gap-2">
            <FaTools className="text-gray-600" />
            <span className="font-semibold text-gray-900">Lịch sử thanh toán</span>
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
              <option value="all">Tất cả</option>
              <option value="paid">Đã thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
            </select>
            
          </div>
        </div>
      </div>

      {/* Lịch sử thanh toán */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Mã thanh toán</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Phương thức</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRecords.map((p) => {
                const paid = isPaymentPaid(p?.status);
                const badgeClass = paid ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
                const amount = Number(p?.amount ?? 0);
                // const currency = p?.currency ?? "VND";
                const amountText = formatCurrency(amount);
                return (
                  <tr key={p?.paymentId ?? p?.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">#{p?.paymentId ?? p?.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{(() => { const m = String(p?.paymentMethod ?? "").trim(); return m || "—"; })()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}>
                        {paid ? "Đã thanh toán" : (p?.status || "Chưa thanh toán")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{amountText}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs" title={p?.description ?? ""}>{p?.description ?? "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{p?.createdAt ? new Date(p.createdAt).toLocaleString("vi-VN") : "—"}</td>
                  </tr>
                );
              })}
              {loading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-sm text-gray-500 text-center"
                  >
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}
              {!loading && currentRecords.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-sm text-gray-500 text-center"
                  >
                    {errorMessage || "Không có dữ liệu thanh toán."}
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
                  setNewMaintenance({
                    carId: "",
                    type: "Bảo dưỡng định kỳ",
                    scheduledDate: "",
                    description: "",
                    price: "",
                    status: 0,
                  });
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
                  <label className="text-sm text-gray-700">
                    Ngày dự kiến <span className="text-red-500">*</span>
                  </label>
                </div>
                <input
                  type="date"
                  name="scheduledDate"
                  value={newMaintenance.scheduledDate}
                  onChange={handleInputChange}
                  placeholder="mm/dd/yyyy"
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
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
                    status: 0,
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
                  setEditMaintenance({
                    carId: "",
                    type: "Bảo dưỡng định kỳ",
                    scheduledDate: "",
                    description: "",
                    price: "",
                    status: 0,
                  });
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
                  <option value={0}>Đã thanh toán</option>
                  <option value={1}>Chờ thanh toán</option>
                  <option value={2}>Thất bại</option>
                  <option value={3}>Đã hủy</option>
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
                  <label className="text-sm text-gray-700">
                    Ngày dự kiến <span className="text-red-500">*</span>
                  </label>
                </div>
                <input
                  type="date"
                  name="scheduledDate"
                  value={editMaintenance.scheduledDate}
                  onChange={handleEditInputChange}
                  placeholder="mm/dd/yyyy"
                  className="w-full px-3 py-2 mt-1 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
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

      {/* Detail Modal */}
      {selectedMaintenance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Chi tiết thanh toán
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (selectedMaintenance?.maintenanceId && selectedMaintenance?.carId) {
                      fetchOwnerPaymentDetails(selectedMaintenance.maintenanceId, selectedMaintenance.carId, true);
                    }
                  }}
                  className="text-blue-600 hover:text-blue-800 p-1 transition-colors"
                  title="Làm mới"
                  disabled={ownerPaymentLoading}
                >
                  <FaSearch className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedMaintenance(null);
                    setOwnerPaymentDetails([]);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="mt-4">
              {/* Owner Payment Status Section */}
              <div>
                {ownerPaymentLoading ? (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-sm text-gray-500">Đang tải thông tin...</p>
                  </div>
                ) : ownerPaymentDetails.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">
                    Chưa có thông tin thành viên sở hữu
                  </div>
                ) : (
                  <div className="space-y-2">
                    {ownerPaymentDetails.map((owner) => (
                      <div
                        key={owner.userId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {owner.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {owner.name}
                          </span>
                        </div>
                        <div>
                          {owner.paymentStatus === "Đã thanh toán" ? (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Đã thanh toán
                            </span>
                          ) : (
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Chờ thanh toán
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

export default PaymentPage;

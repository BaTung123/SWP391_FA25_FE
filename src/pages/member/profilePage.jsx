import React, { useState, useEffect } from 'react';
import Header from '../../components/header/header';
import api from '../../config/axios';

// ======================= VoteList (Member) =======================
const VoteList = () => {
  const [votes, setVotes] = useState([
    {
      id: 1,
      formId: 101,
      vehicleName: 'Tesla Model 3',
      licensePlate: '30A-12345',
      serviceType: 'Bảo dưỡng định kỳ',
      status: 'Chờ đánh giá',
      date: '2024-12-15',
      choice: null,
    },
    {
      id: 2,
      formId: 102,
      vehicleName: 'BYD Atto 3',
      licensePlate: '29B-67890',
      serviceType: 'Sửa hệ thống phanh',
      status: 'Đã đánh giá',
      date: '2024-12-10',
      choice: 'Đồng ý',
    },
  ]);
  const [submittingId, setSubmittingId] = useState(null);

  const getStatusBadge = (status) => {
    const classes =
      status === 'Đã đánh giá'
        ? 'bg-green-100 text-green-800'
        : 'bg-yellow-100 text-yellow-800';
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${classes}`}>
        {status}
      </span>
    );
  };

  const onVote = async (id, choice) => {
    const vote = votes.find((v) => v.id === id);
    if (!vote) return;

    // Lấy userId từ localStorage (tối ưu)
    let userId = null;
    try {
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : null;
      userId = u?.id ?? u?.userId ?? null;
    } catch {}

    if (userId == null) {
      alert('Không xác định được người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    setSubmittingId(id);
    try {
      // API GET /Vote với query params (giữ nguyên theo BE hiện tại)
      await api.get('/Vote', {
        params: {
          userId,
          formId: vote.formId,
          decision: choice === 'Đồng ý',
        },
      });

      // Cập nhật UI khi thành công
      setVotes((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status: 'Đã đánh giá', choice } : v
        )
      );
    } catch (e) {
      alert('Gửi đánh giá thất bại. Vui lòng thử lại.');
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="bg-white border border-indigo-200 rounded-lg shadow-md overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-indigo-50">
            <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Xe</th>
            <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Dịch vụ</th>
            <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Trạng thái</th>
            <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Ngày</th>
            <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {votes.map((vote) => (
            <tr key={vote.id} className="hover:bg-gray-50 transition-colors">
              <td className="border border-indigo-200 px-4 py-3">
                <div className="font-medium text-gray-900">{vote.vehicleName}</div>
                <div className="text-sm text-gray-500">{vote.licensePlate}</div>
              </td>
              <td className="border border-indigo-200 px-4 py-3 text-gray-900 text-sm">{vote.serviceType}</td>
              <td className="border border-indigo-200 px-4 py-3 text-center">{getStatusBadge(vote.status)}</td>
              <td className="border border-indigo-200 px-4 py-3 text-sm text-gray-700 text-center">{vote.date}</td>
              <td className="border border-indigo-200 px-4 py-3">
                {vote.status === 'Chờ đánh giá' ? (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onVote(vote.id, 'Đồng ý')}
                      disabled={submittingId === vote.id}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm disabled:opacity-60"
                    >
                      Đồng ý
                    </button>
                    <button
                      onClick={() => onVote(vote.id, 'Từ chối')}
                      disabled={submittingId === vote.id}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm disabled:opacity-60"
                    >
                      Từ chối
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        vote.choice === 'Đồng ý'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {vote.choice}
                    </span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ======================= ProfilePage =======================
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCoOwnersModal, setShowCoOwnersModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [coOwnersData, setCoOwnersData] = useState([]);
  const [loadingCoOwners, setLoadingCoOwners] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);

  // auth/session
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Validation errors
  const [validationErrors, setValidationErrors] = useState({});

  // server-backed user state (ảnh, email)
  const [user, setUser] = useState({
    email: "",
    avatarImageUrl: null,
    idCardImageUrl: null,
  });

  // form info
  const [form, setForm] = useState({
    name: "",
    fullName: "",
    phone: "",
    nationalId: "",
    licenseNumber: "",
    gender: "",
    dob: "",
  });

  // ---- 1) Lấy userId + role từ localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const parsed = JSON.parse(raw);

      const id = parsed?.id ?? parsed?.userId ?? parsed?.Id ?? parsed?.UserId ?? null;
      const role = parsed?.role ?? parsed?.isRole ?? parsed?.Role ?? null;

      setUserRole(role);
      setUserId(id);
    } catch {
      setUserRole(null);
      setUserId(null);
    }
  }, []);

  // Đảm bảo admin/staff chỉ xem tab profile
  useEffect(() => {
    const roleNum = typeof userRole === "number" ? userRole : Number(userRole ?? 0);
    if ((roleNum === 1 || roleNum === 2) && activeTab !== "profile") {
      setActiveTab("profile");
    }
  }, [userRole, activeTab]);

  // ---- 2) Fetch hồ sơ user từ API khi có userId
  useEffect(() => {
    if (!userId) return;

    const controller = new AbortController();

    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/User/${userId}`, {
          signal: controller.signal,
        });

        const data = res?.data ?? {};
        const safe = (v, fallback = "") =>
          v === null || v === undefined ? fallback : v;

        setUser({
          email: safe(data.email),
          avatarImageUrl: safe(data.avatarImageUrl, null),
          idCardImageUrl: safe(data.idCardImageUrl, null),
        });

        setForm({
          name: safe(data.name) || safe(data.fullName),
          fullName: safe(data.fullName) || safe(data.name),
          phone: safe(data.phone),
          nationalId: safe(data.nationalId),
          licenseNumber: safe(data.licenseNumber),
          gender: safe(data.gender),
          dob: safe(data.dob),
        });

        setValidationErrors({});
      } catch (e) {
        console.error(e);
        setError("Không tải được dữ liệu người dùng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    return () => controller.abort();
  }, [userId]);

  // ---- 3) Validation
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
      case "fullName": {
        const displayName = value || "";
        if (!displayName.trim()) {
          error = "Họ và tên không được để trống";
        } else if (displayName.trim().length < 2) {
          error = "Họ và tên phải có ít nhất 2 ký tự";
        } else if (displayName.trim().length > 100) {
          error = "Họ và tên không được vượt quá 100 ký tự";
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(displayName.trim())) {
          error = "Họ và tên chỉ được chứa chữ cái và khoảng trắng";
        }
        break;
      }
      case "phone": {
        if (!value || value.trim().length === 0) {
          error = "Số điện thoại không được để trống";
        } else {
          const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
          const cleaned = value.replace(/\s+/g, "");
          if (!phoneRegex.test(cleaned)) {
            error = "Số điện thoại không hợp lệ. Vui lòng nhập số Việt Nam (10 số, bắt đầu bằng 0)";
          }
        }
        break;
      }
      case "dob": {
        if (!value) {
          error = "Ngày sinh không được để trống";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          if (isNaN(selectedDate.getTime())) {
            error = "Ngày sinh không hợp lệ";
          } else if (selectedDate > today) {
            error = "Ngày sinh không được trong tương lai";
          } else {
            const age = today.getFullYear() - selectedDate.getFullYear();
            const monthDiff = today.getMonth() - selectedDate.getMonth();
            const actualAge =
              monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())
                ? age - 1
                : age;
            if (actualAge < 18) {
              error = "Bạn phải đủ 18 tuổi trở lên";
            } else if (actualAge > 120) {
              error = "Ngày sinh không hợp lệ";
            }
          }
        }
        break;
      }
      case "licenseNumber": {
        if (value && value.trim().length > 0) {
          if (value.trim().length < 5) error = "Số bằng lái xe phải có ít nhất 5 ký tự";
          else if (value.trim().length > 20) error = "Số bằng lái xe không được vượt quá 20 ký tự";
        }
        break;
      }
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const errors = {};

    const nameError = validateField("name", form.name || form.fullName);
    if (nameError) {
      errors.name = nameError;
      errors.fullName = nameError;
    }

    const phoneError = validateField("phone", form.phone);
    if (phoneError) errors.phone = phoneError;

    const dobError = validateField("dob", form.dob);
    if (dobError) errors.dob = dobError;

    const licenseError = validateField("licenseNumber", form.licenseNumber);
    if (licenseError) errors.licenseNumber = licenseError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---- 4) Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };

        if (name === "name" || name === "fullName") {
          const nameValue = name === "name" ? value : updated.name;
          const fullNameValue = name === "fullName" ? value : updated.fullName;
          const displayName = nameValue || fullNameValue;
          const err = validateField("name", displayName);
          if (err) {
            newErrors.name = err;
            newErrors.fullName = err;
          } else {
            delete newErrors.name;
            delete newErrors.fullName;
          }
        } else {
          const err = validateField(name, value);
          if (err) newErrors[name] = err;
          else delete newErrors[name];
        }

        return newErrors;
      });

      return updated;
    });
  };

  const handleIdCardChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file không được vượt quá 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUser((prev) => ({ ...prev, idCardImageUrl: reader.result }));
    };
    reader.onerror = () => {
      alert("Đã xảy ra lỗi khi đọc file. Vui lòng thử lại.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveIdCard = () => {
    setUser((prev) => ({ ...prev, idCardImageUrl: null }));
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const resolveCarUserId = async (carId, userId) => {
    try {
      const r = await api.get(`/users/${userId}/cars`);
      const arr = Array.isArray(r.data) ? r.data : r.data ? [r.data] : [];
      const found = arr.find((it) => {
        const cid = Number(it?.carId ?? it?.car?.carId ?? it?.car?.id ?? it?.id);
        return Number(cid) === Number(carId);
      });
      if (!found) return null;
      return Number(found?.carUserId ?? found?.CarUserId ?? found?.id);
    } catch {
      return null;
    }
  };

  const getUsersByCar = async (carId) => {
    try {
      const res = await api.get(`/cars/${carId}/users`);
      const arr = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      return arr.map((u) => Number(u?.userId ?? u?.id)).filter((x) => Number.isFinite(x));
    } catch {
      return null;
    }
  };

  const getUserInfo = async (uid) => {
    try {
      const res = await api.get(`/User/${uid}`);
      const data = res?.data ?? {};
      return {
        id: uid,
        name: data.fullName || data.name || data.email || `User #${uid}`,
        email: data.email || '',
        phone: data.phone || '',
      };
    } catch {
      return {
        id: uid,
        name: `User #${uid}`,
        email: '',
        phone: '',
      };
    }
  };

  const handleViewCoOwners = async (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowCoOwnersModal(true);
    setLoadingCoOwners(true);
    setCoOwnersData([]);
    setGroupInfo(null);

    try {
      const carId = vehicle.id || vehicle.carId;
      if (!carId) {
        alert('Không tìm thấy thông tin xe.');
        setLoadingCoOwners(false);
        return;
      }

      // 1. Lấy thông tin group theo carId
      try {
        const groupRes = await api.get('/Group');
        const groups = Array.isArray(groupRes.data) ? groupRes.data : groupRes.data ? [groupRes.data] : [];
        const group = groups.find(g => Number(g.carId) === Number(carId));
        if (group) setGroupInfo(group);
      } catch (e) {
        console.error('Lỗi khi lấy thông tin nhóm:', e);
      }

      // 2. Lấy danh sách userIds sở hữu xe này
      const ownerIds = await getUsersByCar(carId);
      if (!ownerIds || ownerIds.length === 0) {
        setCoOwnersData([]);
        setLoadingCoOwners(false);
        return;
      }

      // 3. Resolve carUserId + user info + ownershipPercentage
      const ownersWithInfo = await Promise.all(
        ownerIds.map(async (uid) => {
          const userInfo = await getUserInfo(uid);
          let percentage = 0;
          try {
            const userCarsRes = await api.get(`/users/${uid}/cars`);
            const userCars = Array.isArray(userCarsRes.data) ? userCarsRes.data : userCarsRes.data ? [userCarsRes.data] : [];
            const carMatch = userCars.find(c => Number(c.carId ?? c.id) === Number(carId));
            if (carMatch && carMatch.ownershipPercentage != null) {
              percentage = Number(carMatch.ownershipPercentage);
            }
          } catch (e) {
            console.error(`Lỗi ownershipPercentage cho user ${uid}:`, e);
          }
          const cuid = await resolveCarUserId(carId, uid);
          return { ...userInfo, carUserId: cuid, percentage: percentage || 0 };
        })
      );

      // Nếu không có phần trăm, phân chia đều
      if (ownersWithInfo.every(o => o.percentage === 0) && ownersWithInfo.length > 0) {
        const equalPercent = Math.floor(100 / ownersWithInfo.length);
        const remainder = 100 - (equalPercent * ownersWithInfo.length);
        ownersWithInfo.forEach((o, idx) => {
          o.percentage = equalPercent + (idx === 0 ? remainder : 0);
        });
      }

      ownersWithInfo.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
      setCoOwnersData(ownersWithInfo);
    } catch (e) {
      console.error('Lỗi khi tải thông tin đồng sở hữu:', e);
      alert('Không thể tải thông tin đồng sở hữu. Vui lòng thử lại.');
      setCoOwnersData([]);
    } finally {
      setLoadingCoOwners(false);
    }
  };

  const closeModal = () => {
    setShowCoOwnersModal(false);
    setSelectedVehicle(null);
    setCoOwnersData([]);
    setGroupInfo(null);
  };

  const handleViewAgreement = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowAgreementModal(true);
  };
  const closeAgreementModal = () => {
    setShowAgreementModal(false);
    setSelectedVehicle(null);
  };

  const closeInsuranceModal = () => {
    setShowInsuranceModal(false);
    setSelectedVehicle(null);
  };

  const handlePrintAgreement = () => window.print();

  const isMember = userRole === 0 || userRole === "0" || Number(userRole) === 0;
  const isAdmin = userRole === 1 || userRole === "1" || Number(userRole) === 1;
  const isStaff = userRole === 2 || userRole === "2" || Number(userRole) === 2;
  const isAdminOrStaff = isAdmin || isStaff;

  const toIsoDateOnly = (v) => {
    if (!v) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
      const [, d, mo, y] = m;
      return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    }
    const dt = new Date(v);
    if (!isNaN(dt.getTime())) {
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth()+1).padStart(2,'0');
      const dd = String(dt.getDate()).padStart(2,'0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return '';
  };

  const handleSave = async () => {
    if (!userId) {
      alert("Không xác định được người dùng.");
      return;
    }
    if (!validateForm()) {
      alert("Vui lòng kiểm tra lại các thông tin đã nhập.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const fd = new FormData();
      const dobIso = toIsoDateOnly(form.dob);

      const entries = {
        email: user.email || "",
        fullName: form.fullName || form.name || "",
        name: form.name || form.fullName || "",
        gender: form.gender || "",
        dob: dobIso || "",
        phone: form.phone || "",
        nationalId: form.nationalId || "",
        licenseNumber: form.licenseNumber || "",
        cccdFront: user.idCardImageUrl || "",
        cccdBack: ""
      };

      Object.entries(entries).forEach(([k, v]) => {
        fd.append(k, v ?? "");
        fd.append(`updateProfileDto.${k}`, v ?? "");
      });

      const res = await api.put(`/api/User/${userId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const updated = res?.data && Object.keys(res.data).length ? res.data : entries;

      setUser((u) => ({
        ...u,
        email: updated.email ?? u.email,
        avatarImageUrl: updated.avatarImageUrl ?? u.avatarImageUrl,
        idCardImageUrl: updated.idCardImageUrl ?? u.idCardImageUrl
      }));

      setForm((f) => ({
        ...f,
        name: updated.name ?? f.name,
        fullName: updated.fullName ?? f.fullName,
        phone: updated.phone ?? f.phone,
        nationalId: updated.nationalId ?? f.nationalId,
        licenseNumber: updated.licenseNumber ?? f.licenseNumber,
        gender: updated.gender ?? f.gender,
        dob: toIsoDateOnly(updated.dob) || f.dob
      }));

      updateLocalStorageUser({
        name: updated.name,
        fullName: updated.fullName,
        phone: updated.phone,
        email: updated.email,
        avatarImageUrl: updated.avatarImageUrl,
        idCardImageUrl: updated.idCardImageUrl
      });

      alert("Thông tin thành viên đã được lưu thành công!");
    } catch (e) {
      console.error(e);
      setError("Cập nhật không thành công. Vui lòng kiểm tra định dạng ngày sinh và dạng gửi (multipart/form-data).");
      alert("Cập nhật không thành công. Kiểm tra lại ngày sinh (YYYY-MM-DD) và dạng gửi.");
    } finally {
      setSaving(false);
    }
  };

  const updateLocalStorageUser = (patch) => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const cur = JSON.parse(raw);
      const next = { ...cur, ...patch };
      localStorage.setItem("user", JSON.stringify(next));
    } catch {}
  };

  // State: danh sách xe lấy từ backend
  const [vehicleData, setVehicleData] = useState([]);

  // Khi vào tab SỞ HỮU XE thì gọi API thật: /api/users/{userId}/cars
  useEffect(() => {
    if (activeTab !== "vehicles" || !userId) return;
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const res = await api.get(`/users/${userId}/cars`);
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

        const mapped = (list || [])
          .filter(Boolean)
          .map((it) => {
            const carId = it.carId ?? it._carId ?? it.id ?? it.Id ?? null;
            const carUserId =
              it.carUserId ?? it.CarUserId ?? it.carUser?.id ?? it.linkId ?? null;

            return {
              id: carId,
              carUserId,
              vehicleName: it.carName ?? it.name ?? it.VehicleName ?? it.vehicleName ?? "",
              licensePlate: it.plateNumber ?? it.plate ?? it.PlateNumber ?? it.licensePlate ?? "",
              purchaseDate: it.purchaseDate ?? it.PurchaseDate ?? it.createdAt ?? null,
              status: it.status ?? it.Status ?? "Active",
              insurance: it.insurance ?? it.Insurance ?? {
                provider: "",
                policyNumber: "",
                startDate: null,
                endDate: null,
                premium: 0,
                monthlyPayment: 0,
                nextPayment: null,
                status: "Active"
              },
              ownershipPercentage: it.ownershipPercentage != null ? Number(it.ownershipPercentage) : 100,
            };
          });

        if (mounted) setVehicleData(mapped);
      } catch (err) {
        console.error("Lỗi khi lấy xe:", err);
        if (mounted) setVehicleData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [activeTab, userId]);

  // Helpers: render safe date
  const renderDate = (d) => (d ? new Date(d).toLocaleDateString("vi-VN") : '---');

  return (
    <div className="w-full">
      {isMember && <Header />}
      <div className="rounded-lg bg-white p-6">
        <h2 className="text-4xl font-bold text-indigo-900 mb-6">
          Thông tin thành viên EV Co-ownership
        </h2>

        {/* Tabs */}
        <div className="flex border-b-2 border-indigo-100 mb-10">
          <div
            className={`py-2 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all ${
              activeTab === "profile"
                ? "text-indigo-900 border-b-3 border-indigo-900"
                : "text-indigo-600 hover:text-indigo-800"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            HỒ SƠ
          </div>
          {!isAdminOrStaff && (
            <>
              <div
                className={`py-2 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all ${
                  activeTab === "vehicles"
                    ? "text-indigo-900 border-b-3 border-indigo-900"
                    : "text-indigo-600 hover:text-indigo-800"
                }`}
                onClick={() => setActiveTab("vehicles")}
              >
                SỞ HỮU XE
              </div>
              <div
                className={`py-2 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all ${
                  activeTab === "insurance"
                    ? "text-indigo-900 border-b-3 border-indigo-900"
                    : "text-indigo-600 hover:text-indigo-800"
                }`}
                onClick={() => setActiveTab("insurance")}
              >
                BẢO HIỂM
              </div>
              <div
                className={`py-2 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all ${
                  activeTab === 'votes' 
                    ? 'text-indigo-900 border-b-3 border-indigo-900' 
                    : 'text-indigo-600 hover:text-indigo-800'
                }`}
                onClick={() => setActiveTab('votes')}
              >
                ĐÁNH GIÁ
              </div>
            </>
          )}
        </div>

        {activeTab === "profile" && (
          <>
            {loading && (
              <div className="mb-4 text-sm text-gray-600">
                Đang tải thông tin...
              </div>
            )}
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

            {user && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left - CCCD */}
                <div className="md:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="relative" />
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Ảnh căn cước
                      </p>
                      <div className="mx-auto w-48">
                        {user.idCardImageUrl ? (
                          <img
                            src={user.idCardImageUrl}
                            alt="Ảnh căn cước"
                            className="w-full h-auto rounded-md border border-gray-200 shadow-sm"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 rounded-md border border-gray-200 shadow-sm flex items-center justify-center">
                            <span className="text-gray-400">
                              Chưa có ảnh căn cước
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="mt-2 flex justify-center space-x-2">
                        <label className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleIdCardChange}
                          />
                          Tải ảnh
                        </label>
                        {user.idCardImageUrl && (
                          <button
                            onClick={handleRemoveIdCard}
                            className="px-3 py-1 border rounded"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right - Form */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            HỌ VÀ TÊN <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="name"
                            value={form.name || form.fullName || ""}
                            onChange={handleChange}
                            className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              validationErrors.name || validationErrors.fullName
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {(validationErrors.name || validationErrors.fullName) && (
                            <p className="text-sm text-red-600 mt-1">
                              {validationErrors.name || validationErrors.fullName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            EMAIL
                          </label>
                          <input
                            name="email"
                            value={user.email}
                            readOnly
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            SỐ ĐIỆN THOẠI <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="phone"
                            value={form.phone || ""}
                            onChange={handleChange}
                            className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              validationErrors.phone
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-200"
                            }`}
                            placeholder="Nhập số điện thoại"
                          />
                          {validationErrors.phone && (
                            <p className="text-sm text-red-600 mt-1">
                              {validationErrors.phone}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            GIỚI TÍNH
                          </label>
                          <select
                            name="gender"
                            value={form.gender || ""}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">-- Chọn --</option>
                            <option value="Male">Nam</option>
                            <option value="Female">Nữ</option>
                            <option value="Other">Khác</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            NGÀY SINH <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="dob"
                            type="date"
                            value={form.dob || ""}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                            className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              validationErrors.dob
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-200"
                            }`}
                          />
                          {validationErrors.dob && (
                            <p className="text-sm text-red-600 mt-1">
                              {validationErrors.dob}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700 text-left">
                            BẰNG LÁI XE
                          </label>
                          <input
                            name="licenseNumber"
                            value={form.licenseNumber || ""}
                            onChange={handleChange}
                            className={`w-full p-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              validationErrors.licenseNumber
                                ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                : "border-gray-200"
                            }`}
                            placeholder="Nhập bằng lái xe"
                          />
                          {validationErrors.licenseNumber && (
                            <p className="text-sm text-red-600 mt-1">
                              {validationErrors.licenseNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-center mt-8">
                        <button
                          onClick={handleSave}
                          disabled={saving || Object.keys(validationErrors).length > 0}
                          className="px-12 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                          {saving ? "ĐANG LƯU..." : "LƯU"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab SỞ HỮU XE */}
        {activeTab === "vehicles" && (
          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-indigo-50">
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">
                      Tên xe
                    </th>
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">
                      Biển số
                    </th>
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">
                      % Sở hữu
                    </th>
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">
                      Ngày sỡ hữu
                    </th>
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">
                      Trạng thái
                    </th>
                    <th className="border border-indigo-200 px-4 py-3 font-semibold text-indigo-900">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleData.length > 0 ? (
                    vehicleData.map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-indigo-200 px-4 py-3">
                          <div className="font-medium text-gray-900">
                            {vehicle.vehicleName}
                          </div>
                        </td>
                        <td className="border border-indigo-200 px-4 py-3">
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
                            {vehicle.licensePlate}
                          </span>
                        </td>
                        <td className="border border-indigo-200 px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-indigo-600 h-2 rounded-full"
                                style={{ width: `${vehicle.ownershipPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {vehicle.ownershipPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="border border-indigo-200 px-4 py-3 text-gray-700">
                          {renderDate(vehicle.purchaseDate)}
                        </td>
                        <td className="border border-indigo-200 px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              vehicle.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {vehicle.status === "Active" ? "Hoạt động" : "Bảo trì"}
                          </span>
                        </td>
                        <td className="border border-indigo-200 px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewCoOwners(vehicle)}
                              className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-50 transition-colors"
                              title="Xem đồng sở hữu"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleViewAgreement(vehicle)}
                              className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
                              title="Xem bảng hợp đồng sở hữu"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="border border-indigo-200 px-4 py-6 text-center text-gray-500" colSpan={6}>
                        Chưa có xe đăng ký thuộc sở hữu của bạn.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab BẢO HIỂM */}
        {activeTab === "insurance" && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {vehicleData.map((vehicle) => (
                <div key={vehicle.id} className="bg-white border border-indigo-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-indigo-900">
                        {vehicle.vehicleName}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.insurance?.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {vehicle.insurance?.status === "Active" ? "Hoạt động" : "Hết hạn"}
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Nhà bảo hiểm:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {vehicle.insurance?.provider || '---'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Số hợp đồng:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {vehicle.insurance?.policyNumber || '---'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Loại bảo hiểm:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {vehicle.insurance?.coverage || '---'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phí bảo hiểm/năm:</span>
                        <span className="text-sm font-bold text-indigo-900">
                          {(vehicle.insurance?.premium || 0).toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phần của bạn:</span>
                        <span className="text-sm font-bold text-red-600">
                          {Math.round(((vehicle.insurance?.monthlyPayment || 0) * (vehicle.ownershipPercentage || 0)) / 100).toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Hạn thanh toán tiếp:</span>
                        <span className="font-medium text-gray-900">
                          {renderDate(vehicle.insurance?.nextPayment)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hiệu lực:</span>
                        <span className="font-medium text-gray-900">
                          {renderDate(vehicle.insurance?.startDate)} - {renderDate(vehicle.insurance?.endDate)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-center">
                      <button className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-sm text-sm font-medium transition-colors">
                        Thanh toán
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {vehicleData.length === 0 && (
                <div className="col-span-full text-center text-gray-500 py-6">
                  Chưa có dữ liệu bảo hiểm.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab ĐÁNH GIÁ */}
        {activeTab === 'votes' && (
          <div className="mb-8">
            <VoteList />
          </div>
        )}

        {/* Co-owners Modal */}
        {showCoOwnersModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto" style={{ maxWidth: '700px' }}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-indigo-900">
                    Đồng sở hữu - {selectedVehicle.vehicleName}
                  </h3>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {loadingCoOwners ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin đồng sở hữu...</p>
                  </div>
                ) : coOwnersData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Chưa có thông tin đồng sở hữu.</p>
                  </div>
                ) : (
                  <div>
                    {/* Thông tin xe */}
                    <div className="mb-4 p-4 bg-indigo-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-indigo-600 font-medium">Xe</p>
                          <p className="text-lg font-bold text-indigo-900">
                            {selectedVehicle.vehicleName || "Chưa có tên"}
                          </p>
                          {selectedVehicle.licensePlate && (
                            <p className="text-sm text-gray-600 mt-1">
                              Biển số: {selectedVehicle.licensePlate}
                            </p>
                          )}
                          {groupInfo && (
                            <p className="text-sm text-gray-600 mt-1">
                              Nhóm: {groupInfo.groupName || 'Chưa có tên nhóm'}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-indigo-600 font-medium">Tổng sở hữu</p>
                          <p className="text-lg font-bold text-indigo-900">
                            {coOwnersData.reduce((sum, owner) => sum + (owner.percentage || 0), 0)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Danh sách đồng sở hữu */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Danh sách đồng sở hữu
                        </h4>
                        <span className="text-sm text-gray-600">
                          Tổng: {coOwnersData.length} người
                        </span>
                      </div>

                      {coOwnersData.map((owner, index) => {
                        const isCurrentUser = userId && Number(owner.id) === Number(userId);
                        const percentage = owner.percentage || 0;
                        return (
                          <div
                            key={owner.id || index}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <span className="text-indigo-600 font-semibold text-sm">
                                      {owner.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                        .substring(0, 2)}
                                    </span>
                                  </div>
                                  <div>
                                    <h5 className="font-semibold text-gray-900">
                                      {owner.name}
                                      {isCurrentUser && (
                                        <span className="ml-2 text-xs text-indigo-600 font-normal">(Bạn)</span>
                                      )}
                                    </h5>
                                    {owner.email && (
                                      <p className="text-sm text-gray-600">{owner.email}</p>
                                    )}
                                    {owner.phone && (
                                      <p className="text-sm text-gray-500">{owner.phone}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 mb-1">Phần trăm đóng góp</p>
                                <div className="flex items-center space-x-2">
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-indigo-600 h-2 rounded-full transition-all"
                                      style={{ width: `${percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-indigo-900 min-w-[2.5rem]">
                                    {percentage}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Agreement Modal */}
        {showAgreementModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-indigo-900">
                    Bảng hợp đồng sở hữu - {selectedVehicle.vehicleName}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={handlePrintAgreement}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      <span>In</span>
                    </button>
                    <button
                      onClick={() => setShowAgreementModal(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Hợp đồng sở hữu xe</h2>
                    <p className="text-gray-600">Hợp đồng giữa các bên liên quan đến xe sử dụng dưới đây.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-lg">
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Tên xe</p>
                      <p className="text-gray-900">{selectedVehicle.vehicleName || '---'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Biển số</p>
                      <p className="text-gray-900">{selectedVehicle.licensePlate || '---'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Ngày mua / Hiệu lực</p>
                      <p className="text-gray-900">{renderDate(selectedVehicle.purchaseDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Trạng thái hợp đồng</p>
                      <p className="text-gray-900">
                        {selectedVehicle.status === 'Active' ? 'Đang hiệu lực' : (selectedVehicle.status || '---')}
                      </p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">Nội quy hợp đồng</h3>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">1. Quyền và nghĩa vụ của các bên</h4>
                        <p>…</p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">2. Trách nhiệm tài chính</h4>
                        <p>…</p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">3. Sử dụng và bảo quản xe</h4>
                        <p>…</p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">4. Giải quyết tranh chấp</h4>
                        <p>…</p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">5. Chấm dứt hợp đồng</h4>
                        <p>…</p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">6. Điều khoản khác</h4>
                        <p>…</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-gray-200">
                    <div>
                      <p className="text-gray-900 mb-2">Ghi chú</p>
                      <p className="text-gray-700 text-sm">Hợp đồng này được lập làm bằng chứng phân chia quyền sở hữu giữa các bên. Các bên cam kết thông tin trên là chính xác.</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-900 mb-2">Chữ ký</p>
                      <div className="h-16 mb-2" />
                      <p className="text-gray-700">Trưởng nhóm</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Insurance Modal (placeholder nội dung chi tiết) */}
        {showInsuranceModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-indigo-900">
                    Chi tiết bảo hiểm - {selectedVehicle.vehicleName}
                  </h3>
                  <button
                    onClick={() => setShowInsuranceModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {/* Nội dung chi tiết bảo hiểm */}
                {/* … */}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;

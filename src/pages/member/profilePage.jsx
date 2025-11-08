import React, { useState, useEffect } from 'react';
import Header from '../../components/header/header';
import api from '../../config/axios';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCoOwnersModal, setShowCoOwnersModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [coOwnersData, setCoOwnersData] = useState([]);
  const [loadingCoOwners, setLoadingCoOwners] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);
  const [activities, setActivities] = useState([]);
  const [showActivityDetailModal, setShowActivityDetailModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityVotes, setActivityVotes] = useState({ agree: 0, disagree: 0, total: 0 });
  const [userVote, setUserVote] = useState(null);
  const [loadingActivityDetail, setLoadingActivityDetail] = useState(false);
  const [totalMembers, setTotalMembers] = useState(3);

  // auth/session
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  // server-backed user state (ảnh, email)
  const [user, setUser] = useState({
    email: "",
    avatarImageUrl: null,
    idCardImageUrl: null,
  });

  // form info (điền hồ sơ)
  const [form, setForm] = useState({
    name: "",
    fullName: "",
    phone: "",
    nationalId: "",
    licenseNumber: "",
    gender: "",
    dob: "",
  });

  // Local previews for ID card front / back
  const [idCardFront, setIdCardFront] = useState(null);
  const [idCardBack, setIdCardBack] = useState(null);

  // ---- 1) Lấy userId + role từ localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const id =
        parsed?.id ?? parsed?.userId ?? parsed?.Id ?? parsed?.UserId ?? null;

      const role = parsed?.role ?? parsed?.Role ?? null;

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
        // populate front/back previews if available from API
        try {
          setIdCardFront(safe(data.cccdFront ?? data.cccdFrontUrl ?? data.idCardFront ?? data.idCardImageUrl ?? null, null));
          setIdCardBack(safe(data.cccdBack ?? data.cccdBackUrl ?? data.idCardBack ?? null, null));
        } catch {}
        
        // Clear validation errors when data is loaded
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

  // ---- 3) Validation functions
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
      case "fullName":
        // For name/fullName, use the provided value (which should be the combined value)
        const displayName = value || "";
        
        if (!displayName || displayName.trim().length === 0) {
          error = "Họ và tên không được để trống";
        } else if (displayName.trim().length < 2) {
          error = "Họ và tên phải có ít nhất 2 ký tự";
        } else if (displayName.trim().length > 100) {
          error = "Họ và tên không được vượt quá 100 ký tự";
        } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(displayName.trim())) {
          error = "Họ và tên chỉ được chứa chữ cái và khoảng trắng";
        }
        break;

      case "phone":
        if (!value || value.trim().length === 0) {
          error = "Số điện thoại không được để trống";
        } else {
          const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
          const cleanedPhone = value.replace(/\s+/g, "");
          if (!phoneRegex.test(cleanedPhone)) {
            error = "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 số, bắt đầu bằng 0)";
          }
        }
        break;

      case "dob":
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
            const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate()) 
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

      case "licenseNumber":
        if (value && value.trim().length > 0) {
          if (value.trim().length < 5) {
            error = "Số bằng lái xe phải có ít nhất 5 ký tự";
          } else if (value.trim().length > 20) {
            error = "Số bằng lái xe không được vượt quá 20 ký tự";
          }
        }
        break;

      case "gender":
        // Gender is optional, no validation needed
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate name/fullName
    const nameError = validateField("name", form.name || form.fullName);
    if (nameError) {
      errors.name = nameError;
      errors.fullName = nameError;
    }

    // Validate phone
    const phoneError = validateField("phone", form.phone);
    if (phoneError) errors.phone = phoneError;

    // Validate dob
    const dobError = validateField("dob", form.dob);
    if (dobError) errors.dob = dobError;

    // Validate licenseNumber (optional but if provided, must be valid)
    const licenseError = validateField("licenseNumber", form.licenseNumber);
    if (licenseError) errors.licenseNumber = licenseError;

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---- 4) Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Update form state
    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };
      
      // Validate field on change with updated form values
      const error = validateField(name, name === "name" || name === "fullName" 
        ? (name === "name" ? value : (value || prev.name))
        : value);
      
      setValidationErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        
        // Handle name/fullName validation together
        if (name === "name" || name === "fullName") {
          const nameValue = name === "name" ? value : updatedForm.name;
          const fullNameValue = name === "fullName" ? value : updatedForm.fullName;
          const displayName = nameValue || fullNameValue;
          
          const nameError = validateField("name", displayName);
          if (nameError) {
            newErrors.name = nameError;
            newErrors.fullName = nameError;
          } else {
            delete newErrors.name;
            delete newErrors.fullName;
          }
        } else {
          // Handle other fields
          if (error) {
            newErrors[name] = error;
          } else {
            delete newErrors[name];
          }
        }
        
        return newErrors;
      });
      
      return updatedForm;
    });
  };

  // Upload/remove ảnh CCCD front/back (preview local)
  const handleIdCardUpload = (e, side = 'front') => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file hình ảnh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (side === 'back') {
        setIdCardBack(dataUrl);
      } else {
        setIdCardFront(dataUrl);
      }
      // keep a fallback single url for backwards compatibility
      setUser((prev) => ({ ...prev, idCardImageUrl: prev.idCardImageUrl || dataUrl }));
    };
    reader.onerror = () => {
      alert('Đã xảy ra lỗi khi đọc file. Vui lòng thử lại.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveIdCard = (side = 'front') => {
    if (side === 'back') setIdCardBack(null);
    else setIdCardFront(null);
    // clear single fallback as well if both removed
    setUser((prev) => ({ ...prev, idCardImageUrl: null }));
    // clear file inputs if any
    try {
      const inputs = document.querySelectorAll('input[type="file"]');
      inputs.forEach((i) => {
        try { i.value = ''; } catch {}
      });
    } catch {}
  };

  // simple adapters so new JSX names map to existing handlers/state
  const handleProfileChange = (e) => handleChange(e);
  const handleSaveProfile = () => handleSave();

  // Helper: Resolve carUserId cho (carId, userId)
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

  // Helper: Lấy users sở hữu xe
  const getUsersByCar = async (carId) => {
    try {
      const res = await api.get(`/cars/${carId}/users`);
      const arr = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      return arr.map((u) => Number(u?.userId ?? u?.id)).filter((x) => Number.isFinite(x));
    } catch {
      return null;
    }
  };

  // Helper: Lấy thông tin user từ userId
  const getUserInfo = async (userId) => {
    try {
      const res = await api.get(`/User/${userId}`);
      const data = res?.data ?? {};
      return {
        id: userId,
        name: data.fullName || data.name || data.email || `User #${userId}`,
        email: data.email || '',
        phone: data.phone || '',
      };
    } catch {
      return {
        id: userId,
        name: `User #${userId}`,
        email: '',
        phone: '',
      };
    }
  };

  // Helper: Lấy PercentOwnership
  const getPercentOwnership = async () => {
    try {
      const r = await api.get("/PercentOwnership");
      return Array.isArray(r.data) ? r.data : r.data ? [r.data] : [];
    } catch {
      try {
        const r2 = await api.get("/api/PercentOwnership");
        return Array.isArray(r2.data) ? r2.data : r2.data ? [r2.data] : [];
      } catch {
        return [];
      }
    }
  };

  const handleViewCoOwners = async (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowCoOwnersModal(true);
    setLoadingCoOwners(true);
    setCoOwnersData([]);
    setGroupInfo(null);
    setActivities([]);

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
        if (group) {
          setGroupInfo(group);
        }
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

      // 3. Resolve carUserId cho từng user, lấy thông tin user và ownershipPercentage từ API
      const ownersWithInfo = await Promise.all(
        ownerIds.map(async (uid) => {
          // Lấy thông tin user
          const userInfo = await getUserInfo(uid);
          
          // Lấy thông tin xe của user để có ownershipPercentage
          let percentage = 0;
          try {
            const userCarsRes = await api.get(`/users/${uid}/cars`);
            const userCars = Array.isArray(userCarsRes.data) ? userCarsRes.data : userCarsRes.data ? [userCarsRes.data] : [];
            const carMatch = userCars.find(c => Number(c.carId ?? c.id) === Number(carId));
            if (carMatch && carMatch.ownershipPercentage != null) {
              percentage = Number(carMatch.ownershipPercentage);
            }
          } catch (e) {
            console.error(`Lỗi khi lấy ownershipPercentage cho user ${uid}:`, e);
          }
          
          // Resolve carUserId
          const cuid = await resolveCarUserId(carId, uid);
          
          return { 
            ...userInfo, 
            carUserId: cuid,
            percentage: percentage || 0
          };
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

      // Sắp xếp theo phần trăm giảm dần để dễ nhìn
      ownersWithInfo.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));

      setCoOwnersData(ownersWithInfo);

      // (activities/vote UI removed) 
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

  // (activity detail / voting handlers removed)

  // (voting API handler removed)

  const handlePrintAgreement = () => window.print();

  const isMember = userRole === 0 || userRole === "0" || Number(userRole) === 0;
  const isAdmin = userRole === 1 || userRole === "1" || Number(userRole) === 1;
  const isStaff = userRole === 2 || userRole === "2" || Number(userRole) === 2;
  const isAdminOrStaff = isAdmin || isStaff;

  const toIsoDateOnly = (v) => {
  if (!v) return '';
  // nếu input type="date" -> đã là yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
  // nếu dd/MM/yyyy -> convert
  const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [ , d, mo, y ] = m;
    const dd = String(d).padStart(2, '0');
    const mm = String(mo).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  }
  // fallback: Date.parse
  const dt = new Date(v);
  if (!isNaN(dt)) {
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth()+1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  return '';
};

const handleSave = async () => {
  if (!userId) {
    alert("Không xác định được người dùng.");
    return;
  }

  // Validate form before submitting
  if (!validateForm()) {
    alert("Vui lòng kiểm tra lại các thông tin đã nhập.");
    return;
  }

  setSaving(true);
  setError("");

  try {
    // 1) Tạo FormData đúng với [FromForm] UpdateProfileDto updateProfileDto
    const fd = new FormData();

    // giá trị đã chuẩn hoá ngày
    const dobIso = toIsoDateOnly(form.dob);

    // append cả dạng có prefix (updateProfileDto.*) và không prefix để an toàn
    const entries = {
      email: user.email || "",
      fullName: form.fullName || form.name || "",
      name: form.name || form.fullName || "",
      gender: form.gender || "",
      dob: dobIso || "",
      phone: form.phone || "",
      nationalId: form.nationalId || "",
      licenseNumber: form.licenseNumber || "",
  // nếu backend nhận chuỗi URL/base64 cho CCCD (front/back):
  cccdFront: idCardFront || user.idCardImageUrl || "",
  cccdBack: idCardBack || ""
    };

    Object.entries(entries).forEach(([k, v]) => {
      fd.append(k, v ?? "");
      fd.append(`updateProfileDto.${k}`, v ?? "");
    });

    // 2) Gọi PUT multipart
    const res = await api.put(`/api/User/${userId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    // 3) Đồng bộ UI (nếu server không trả body thì lấy form hiện tại)
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

    // 4) Cập nhật localStorage nếu app dùng ở nơi khác
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
        // gọi danh sách CarUser (hoặc tương đương) từ BE
        const res = await api.get(`/users/${userId}/cars`);
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

        // chuẩn hoá dữ liệu về dạng mà UI đang sử dụng
        const mapped = await Promise.all(
          (list || [])
            .filter(Boolean)
            .map(async (it) => {
              const carId = it.carId ?? it._carId ?? it.id ?? it.Id ?? null;
              const carUserId =
                it.carUserId ?? it.CarUserId ?? it.carUser?.id ?? it.carUserId ?? it.linkId ?? null;

              // Lấy số thành viên sở hữu xe
              let memberCount = 1;
              if (carId) {
                try {
                  const ownerIds = await getUsersByCar(carId);
                  memberCount = ownerIds && ownerIds.length > 0 ? ownerIds.length : 1;
                } catch (e) {
                  console.error(`Lỗi khi lấy số thành viên cho xe ${carId}:`, e);
                }
              }

              return {
                id: carId,
                carUserId,
                vehicleName: it.carName ?? it.name ?? it.VehicleName ?? it.vehicleName ?? "",
                licensePlate: it.plateNumber ?? it.plate ?? it.PlateNumber ?? it.licensePlate ?? "",
                purchaseDate: it.purchaseDate ?? it.PurchaseDate ?? it.createdAt ?? null,
                status: it.status ?? it.Status ?? "Active",
                insurance: it.insurance ?? it.Insurance ?? { provider: "", policyNumber: "", startDate: null, endDate: null, premium: 0, monthlyPayment: 0, nextPayment: null, status: "Active" },
                // Sử dụng ownershipPercentage trực tiếp từ API response
                ownershipPercentage: it.ownershipPercentage != null ? Number(it.ownershipPercentage) : 100,
                memberCount: memberCount,
              };
            })
        );

        if (mounted) setVehicleData(mapped);
      } catch (err) {
        console.error("Lỗi khi lấy xe:", err);
        if (mounted) setVehicleData([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [activeTab, userId]);

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
            className={`py-2 px-4 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all rounded-t-lg ${
              activeTab === "profile"
                ? "bg-purple-600 text-white"
                : "text-indigo-600 hover:text-indigo-800"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            HỒ SƠ
          </div>
          {!isAdminOrStaff && (
            <>
              <div
                className={`py-2 px-4 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all rounded-t-lg ${
                  activeTab === "vehicles"
                    ? "bg-purple-600 text-white"
                    : "text-indigo-600 hover:text-indigo-800"
                }`}
                onClick={() => setActiveTab("vehicles")}
              >
                SỞ HỮU XE
              </div>
              <div
                className={`py-2 px-4 font-semibold cursor-pointer mr-8 text-[16px] tracking-wider transition-all rounded-t-lg ${
                  activeTab === "insurance"
                    ? "bg-purple-600 text-white"
                    : "text-indigo-600 hover:text-indigo-800"
                }`}
                onClick={() => setActiveTab("insurance")}
              >
                BẢO HIỂM
              </div>
              {/* Đã xóa tab ĐÁNH GIÁ theo yêu cầu */}
            </>
          )}
        </div>

        {activeTab === "profile" && (
          <>
            {loading && (
              <div className="mb-4 text-sm text-gray-600">Đang tải thông tin...</div>
            )}
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

            {/* Profile Tab */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - ID Card Upload */}
              <div className="border-indigo-100 shadow-lg lg:col-span-1 rounded-lg border p-4 bg-white">
                <div className="pb-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-indigo-900">Ảnh căn cước</div>
                  <div className="text-sm text-gray-500">Tải lên ảnh mặt trước và mặt sau</div>
                </div>
                <div className="space-y-4">
                  {/* Front Side */}
                  <div className="space-y-2">
                    <label className="text-sm text-slate-700">Mặt trước</label>
                    <div className="relative group">
                      {idCardFront ? (
                        <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden border-2 border-indigo-200 shadow-md">
                          <img src={idCardFront} alt="ID Card Front" className="w-full h-full object-cover" />
                          <button
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-full flex items-center justify-center"
                            onClick={() => handleRemoveIdCard('front')}
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <label className="relative w-full aspect-[3/2] flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 cursor-pointer transition-all">
                          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleIdCardUpload(e, 'front')} />
                          <div className="w-8 h-8 text-slate-400">📤</div>
                          <span className="text-sm text-slate-500">Click để tải lên</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="space-y-2">
                    <label className="text-sm text-slate-700">Mặt sau</label>
                    <div className="relative group">
                      {idCardBack ? (
                        <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden border-2 border-indigo-200 shadow-md">
                          <img src={idCardBack} alt="ID Card Back" className="w-full h-full object-cover" />
                          <button
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white rounded-full flex items-center justify-center"
                            onClick={() => handleRemoveIdCard('back')}
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <label className="relative w-full aspect-[3/2] flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50 cursor-pointer transition-all">
                          <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleIdCardUpload(e, 'back')} />
                          <div className="w-8 h-8 text-slate-400">📤</div>
                          <span className="text-sm text-slate-500">Click để tải lên</span>
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Profile Form */}
              <div className="border-indigo-100 shadow-lg lg:col-span-2 rounded-lg border p-4 bg-white">
                <div className="pb-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-indigo-900">Thông tin cá nhân</div>
                  <div className="text-sm text-gray-500">Cập nhật thông tin tài khoản của bạn</div>
                </div>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={user.email} readOnly className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 cursor-not-allowed" />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Nhập số điện thoại" />
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Giới tính</label>
                      <select name="gender" value={form.gender} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                        <option value="">-- Chọn --</option>
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Ngày sinh <span className="text-red-500">*</span></label>
                      <input type="date" name="dob" value={form.dob} onChange={handleProfileChange} max={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                    </div>

                    {/* License Number */}
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Bằng lái xe</label>
                      <input type="text" name="licenseNumber" value={form.licenseNumber} onChange={handleProfileChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Nhập số bằng lái xe" />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="mt-8 flex justify-center">
                    <button className="px-12 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white rounded" onClick={handleSaveProfile}>
                      Lưu thông tin
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab SỞ HỮU XE - Card Layout */}
        {activeTab === "vehicles" && (
          <div className="mb-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">Đang tải thông tin xe...</p>
              </div>
            ) : vehicleData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Chưa có xe đăng ký thuộc sở hữu của bạn.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicleData.map((vehicle) => {
                  // Extract model name (e.g., "VF5" from "VinFast VF5")
                  const modelMatch = vehicle.vehicleName.match(/(VF\d+|VF-\d+)/i);
                  const modelName = modelMatch ? modelMatch[1].toUpperCase() : vehicle.vehicleName.split(' ').pop() || 'Xe';
                  
                  return (
                    <div
                      key={vehicle.id}
                      className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                    >
                      {/* Header: Model name and Status */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                          {modelName}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            vehicle.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {vehicle.status === "Active" ? "Hoạt động" : "Bảo trì"}
                        </span>
                      </div>

                      {/* Car Details */}
                      <div className="space-y-3 mb-6">
                        <div>
                          <span className="text-sm text-gray-600">Tên xe:</span>
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            {vehicle.vehicleName || "---"}
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-600">Biển số xe:</span>
                          <div className="mt-1">
                            <span className="bg-blue-400 text-white px-2 py-1 rounded text-sm font-medium">
                              {vehicle.licensePlate || "---"}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-600">Số thành viên:</span>
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            {vehicle.memberCount || 1} người
                          </div>
                        </div>

                        <div>
                          <span className="text-sm text-gray-600">Phần của bạn:</span>
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            {vehicle.ownershipPercentage || 0}%
                          </div>
                        </div>
                      </div>

                      {/* View Group Button */}
                      <button
                        onClick={() => handleViewCoOwners(vehicle)}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all"
                      >
                        Xem nhóm
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "insurance" && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {vehicleData.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white border border-indigo-200 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-indigo-900">
                        {vehicle.vehicleName}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          vehicle.insurance.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {vehicle.insurance.status === "Active"
                          ? "Hoạt động"
                          : "Hết hạn"}
                      </span>
                    </div>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Nhà bảo hiểm:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {vehicle.insurance.provider}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Số hợp đồng:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {vehicle.insurance.policyNumber}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Loại bảo hiểm:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {vehicle.insurance.coverage}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Phí bảo hiểm/năm:
                        </span>
                        <span className="text-sm font-bold text-indigo-900">
                          {vehicle.insurance.premium.toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Phần của bạn:
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          {Math.round(
                            (vehicle.insurance.monthlyPayment *
                              vehicle.ownershipPercentage) /
                              100
                          ).toLocaleString("vi-VN")}{" "}
                          VNĐ
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">
                          Hạn thanh toán tiếp:
                        </span>
                        <span className="font-medium text-gray-900">
                          {new Date(
                            vehicle.insurance.nextPayment
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hiệu lực:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(
                            vehicle.insurance.startDate
                          ).toLocaleDateString("vi-VN")}{" "}
                          -{" "}
                          {new Date(
                            vehicle.insurance.endDate
                          ).toLocaleDateString("vi-VN")}
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
            </div>
          </div>
        )}

        {/* Tab ĐÁNH GIÁ đã bị xóa */}

        {/* Co-owners Modal - Chi tiết nhóm */}
        {showCoOwnersModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto" style={{ maxWidth: '600px' }}>
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <rect x="3" y="8" width="18" height="6" rx="1" />
                        <circle cx="7" cy="17" r="2" />
                        <circle cx="17" cy="17" r="2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Chi tiết nhóm {selectedVehicle.vehicleName?.match(/(VF\d+|VF-\d+)/i)?.[0]?.toUpperCase() || selectedVehicle.vehicleName?.split(' ').pop() || 'Xe'}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedVehicle.vehicleName || "---"} • {selectedVehicle.licensePlate || "---"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {loadingCoOwners ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Thành viên Section */}
                    <div>
                      <div className="border-b border-gray-200 pb-3 mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Thành viên</h4>
                      </div>
                      
                      {coOwnersData.length === 0 ? (
                        <p className="text-gray-500 text-sm">Chưa có thông tin thành viên.</p>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-4 mb-3 text-sm font-medium text-gray-600">
                            <div>Thành viên</div>
                            <div className="text-right">% Sở hữu</div>
                          </div>
                          
                          <div className="space-y-3 mb-4">
                            {coOwnersData.map((owner, index) => {
                              const isCurrentUser = userId && Number(owner.id) === Number(userId);
                              const percentage = owner.percentage || 0;
                              const avatarColor = isCurrentUser ? 'bg-purple-500' : 'bg-gray-400';
                              
                              return (
                                <div key={owner.id || index} className="flex items-center justify-between">
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className={`w-10 h-10 ${avatarColor} rounded-full flex items-center justify-center`}>
                                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                      {isCurrentUser ? 'Bạn' : owner.name}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-200 rounded-full h-2">
                                      <div
                                        className={`h-2 rounded-full ${isCurrentUser ? 'bg-purple-500' : 'bg-gray-400'}`}
                                        style={{ width: `${percentage}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-right">
                                      {percentage}%
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Tổng cộng */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <span className="text-sm font-medium text-gray-900">Tổng cộng</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-right">100%</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Hợp đồng Section */}
                    <div>
                      <div className="border-b border-gray-200 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h4 className="text-lg font-semibold text-gray-900">Hợp đồng</h4>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          closeModal();
                          handleViewAgreement(selectedVehicle);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Xem hợp đồng
                      </button>
                    </div>

                    {/* Hoạt động (removed) */}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                      <span>In</span>
                    </button>
                    <button
                      onClick={closeAgreementModal}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Hợp đồng sở hữu xe</h2>
                    <p className="text-gray-600">Hợp đồng giữa các bên liên quan đến xe sử dụng dưới đây.</p>
                  </div>

                  {/* Vehicle details */}
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
                      <p className="text-gray-900">{selectedVehicle.purchaseDate ? new Date(selectedVehicle.purchaseDate).toLocaleDateString('vi-VN') : '---'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Trạng thái hợp đồng</p>
                      <p className="text-gray-900">{selectedVehicle.status === 'Active' ? 'Đang hiệu lực' : (selectedVehicle.status || '---')}</p>
                    </div>
                  </div>


                  <div className="mb-8">
                    <h3 className="text-gray-900 mb-4 pb-2 border-b border-gray-200">Nội quy hợp đồng</h3>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">1. Quyền và nghĩa vụ của các bên</h4>
                        <p>
                          Các bên tham gia hợp đồng sở hữu xe có quyền và nghĩa vụ theo tỷ lệ phần trăm sở hữu đã cam kết. Mọi quyết định liên quan đến việc sử dụng, bảo dưỡng, hoặc chuyển nhượng xe phải được sự đồng ý của tất cả các bên.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">2. Trách nhiệm tài chính</h4>
                        <p>
                          Các chi phí liên quan đến xe bao gồm bảo hiểm, bảo dưỡng, sửa chữa, và phí đăng kiểm sẽ được phân bổ theo tỷ lệ sở hữu. Mọi thành viên có nghĩa vụ đóng góp đầy đủ và đúng hạn các khoản chi phí đã thỏa thuận.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">3. Sử dụng và bảo quản xe</h4>
                        <p>
                          Xe phải được sử dụng đúng mục đích và tuân thủ luật giao thông. Các bên có trách nhiệm bảo quản xe cẩn thận, không cho thuê hoặc chuyển nhượng quyền sử dụng cho bên thứ ba mà không có sự đồng ý bằng văn bản của tất cả các bên.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">4. Giải quyết tranh chấp</h4>
                        <p>
                          Mọi tranh chấp phát sinh trong quá trình thực hiện hợp đồng sẽ được giải quyết thông qua thương lượng hòa giải. Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra cơ quan pháp luật có thẩm quyền giải quyết.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">5. Chấm dứt hợp đồng</h4>
                        <p>
                          Hợp đồng có thể chấm dứt khi xe được bán hoặc khi tất cả các bên đồng ý chấm dứt bằng văn bản. Trong trường hợp chấm dứt hợp đồng, các bên sẽ thanh toán các khoản chi phí còn tồn đọng và phân chia tài sản theo tỷ lệ sở hữu.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">6. Điều khoản khác</h4>
                        <p>
                          Mọi sửa đổi, bổ sung hợp đồng phải được lập thành văn bản và có chữ ký của tất cả các bên. Hợp đồng này được lập thành nhiều bản có giá trị pháp lý như nhau, mỗi bên giữ một bản.
                        </p>
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

        {showInsuranceModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-indigo-900">
                    Chi tiết bảo hiểm - {selectedVehicle.vehicleName}
                  </h3>
                  <button
                    onClick={closeInsuranceModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Nội dung chi tiết bảo hiểm giữ nguyên */}
                {/* ... */}
              </div>
            </div>
          </div>
        )}

        {/* Activity Detail Modal removed */}
      </div>
    </div>
  );
};

export default ProfilePage;
import React, { useState, useEffect } from 'react';
import Header from '../../components/header/header';
import api from '../../config/axios';

const ProfilePage = () => {
  // =========================
  // BASIC STATES
  // =========================
  const [activeTab, setActiveTab] = useState("profile");

  const [showCoOwnersModal, setShowCoOwnersModal] = useState(false);
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [coOwnersData, setCoOwnersData] = useState([]);
  const [loadingCoOwners, setLoadingCoOwners] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);
  const [groupLeaderId, setGroupLeaderId] = useState(null);

  // auth/session
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // form errors
  const [validationErrors, setValidationErrors] = useState({});

  // server-backed user state
  const [user, setUser] = useState({
    email: "",
    avatarImageUrl: null,
    idCardImageUrl: null,
  });

  // profile form
  const [form, setForm] = useState({
    name: "",
    fullName: "",
    phone: "",
    nationalId: "",
    licenseNumber: "",
    gender: "",
    dob: "",
  });

  // id card previews
  const [idCardFront, setIdCardFront] = useState(null);
  const [idCardBack, setIdCardBack] = useState(null);

  const K = (v) => (v === null || v === undefined ? "" : String(v));

  const nowIso = () => new Date().toISOString();
  const addDaysIso = (d = 7) => {
    const x = new Date();
    x.setDate(x.getDate() + d);
    return x.toISOString();
  };

  // =========================
  // READ USER FROM LOCALSTORAGE
  // =========================
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const id = parsed?.id ?? parsed?.userId ?? parsed?.Id ?? parsed?.UserId ?? null;
      const role = parsed?.role ?? parsed?.Role ?? null;
      setUserRole(role);
      setUserId(id);
    } catch {
      setUserRole(null);
      setUserId(null);
    }
  }, []);

  // Admin/Staff chỉ xem tab profile
  useEffect(() => {
    const roleNum = typeof userRole === "number" ? userRole : Number(userRole ?? 0);
    if ((roleNum === 1 || roleNum === 2) && activeTab !== "profile") {
      setActiveTab("profile");
    }
  }, [userRole, activeTab]);

  // =========================
  // FETCH USER PROFILE
  // =========================
  useEffect(() => {
    if (!userId) return;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/User/${userId}`, { signal: controller.signal });
        const data = res?.data ?? {};
        const safe = (v, fb = "") => (v === null || v === undefined ? fb : v);

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

        try {
          setIdCardFront(safe(data.cccdFront ?? data.cccdFrontUrl ?? data.idCardFront ?? data.idCardImageUrl ?? null, null));
          setIdCardBack(safe(data.cccdBack ?? data.cccdBackUrl ?? data.idCardBack ?? null, null));
        } catch {}
        setValidationErrors({});
      } catch (e) {
        console.error(e);
        setError("Không tải được dữ liệu người dùng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [userId]);

  // =========================
  // VALIDATION
  // =========================
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
      case "fullName": {
        const displayName = value || "";
        if (!displayName || displayName.trim().length === 0) error = "Họ và tên không được để trống";
        else if (displayName.trim().length < 2) error = "Họ và tên phải có ít nhất 2 ký tự";
        else if (displayName.trim().length > 100) error = "Họ và tên không được vượt quá 100 ký tự";
        else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(displayName.trim())) error = "Họ và tên chỉ được chứa chữ cái và khoảng trắng";
        break;
      }
      case "phone": {
        if (!value || value.trim().length === 0) error = "Số điện thoại không được để trống";
        else {
          const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
          const cleanedPhone = value.replace(/\s+/g, "");
          if (!phoneRegex.test(cleanedPhone)) error = "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (10 số, bắt đầu bằng 0)";
        }
        break;
      }
      case "dob": {
        if (!value) error = "Ngày sinh không được để trống";
        else {
          const selectedDate = new Date(value);
          const today = new Date(); today.setHours(0,0,0,0);
          if (isNaN(selectedDate.getTime())) error = "Ngày sinh không hợp lệ";
          else if (selectedDate > today) error = "Ngày sinh không được trong tương lai";
          else {
            const age = today.getFullYear() - selectedDate.getFullYear();
            const monthDiff = today.getMonth() - selectedDate.getMonth();
            const actualAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate()) ? age - 1 : age;
            if (actualAge < 18) error = "Bạn phải đủ 18 tuổi trở lên";
            else if (actualAge > 120) error = "Ngày sinh không hợp lệ";
          }
        }
        break;
      }
      case "licenseNumber":
        if (value && value.trim().length > 0) {
          if (value.trim().length < 5) error = "Số bằng lái xe phải có ít nhất 5 ký tự";
          else if (value.trim().length > 20) error = "Số bằng lái xe không được vượt quá 20 ký tự";
        }
        break;
      default: break;
    }
    return error;
  };

  const validateForm = () => {
    const errors = {};
    const nameError = validateField("name", form.name || form.fullName);
    if (nameError) { errors.name = nameError; errors.fullName = nameError; }
    const phoneError = validateField("phone", form.phone);
    if (phoneError) errors.phone = phoneError;
    const dobError = validateField("dob", form.dob);
    if (dobError) errors.dob = dobError;
    const licenseError = validateField("licenseNumber", form.licenseNumber);
    if (licenseError) errors.licenseNumber = licenseError;
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // =========================
  // HANDLERS: FORM & UPLOAD
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      const error = validateField(name, name === "name" || name === "fullName"
        ? (name === "name" ? value : (value || prev.name))
        : value);

      setValidationErrors((prevErrors) => {
        const next = { ...prevErrors };
        if (name === "name" || name === "fullName") {
          const displayName = (name === "name" ? value : updated.name) || (name === "fullName" ? value : updated.fullName);
          const nmErr = validateField("name", displayName);
          if (nmErr) { next.name = nmErr; next.fullName = nmErr; }
          else { delete next.name; delete next.fullName; }
        } else {
          if (error) next[name] = error;
          else delete next[name];
        }
        return next;
      });

      return updated;
    });
  };

  const handleIdCardUpload = (e, side = 'front') => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Vui lòng chọn file hình ảnh'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Kích thước file không được vượt quá 5MB'); return; }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (side === 'back') setIdCardBack(dataUrl);
      else setIdCardFront(dataUrl);
      setUser((prev) => ({ ...prev, idCardImageUrl: prev.idCardImageUrl || dataUrl }));
    };
    reader.onerror = () => { alert('Đã xảy ra lỗi khi đọc file. Vui lòng thử lại.'); };
    reader.readAsDataURL(file);
  };

  const handleRemoveIdCard = (side = 'front') => {
    if (side === 'back') setIdCardBack(null);
    else setIdCardFront(null);
    setUser((prev) => ({ ...prev, idCardImageUrl: null }));
    try {
      const inputs = document.querySelectorAll('input[type="file"]');
      inputs.forEach((i) => { try { i.value = ''; } catch {} });
    } catch {}
  };

  const toIsoDateOnly = (v) => {
    if (!v) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const m = v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) {
      const [ , d, mo, y ] = m;
      const dd = String(d).padStart(2, '0');
      const mm = String(mo).padStart(2, '0');
      return `${y}-${mm}-${dd}`;
    }
    const dt = new Date(v);
    if (!isNaN(dt)) {
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth()+1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
    return '';
  };

  const handleSaveProfile = async () => {
    if (!userId) { alert("Không xác định được người dùng."); return; }
    if (!validateForm()) { alert("Vui lòng kiểm tra lại các thông tin đã nhập."); return; }

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
        cccdFront: idCardFront || user.idCardImageUrl || "",
        cccdBack: idCardBack || ""
      };

      Object.entries(entries).forEach(([k, v]) => {
        fd.append(k, v ?? "");
        fd.append(`updateProfileDto.${k}`, v ?? "");
      });

      const res = await api.put(`/User/${userId}`, fd, {
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

      try {
        const raw = localStorage.getItem("user");
        if (raw) {
          const cur = JSON.parse(raw);
          const next = { ...cur, ...updated };
          localStorage.setItem("user", JSON.stringify(next));
        }
      } catch {}

      alert("Thông tin thành viên đã được lưu thành công!");
    } catch (e) {
      console.error(e);
      setError("Cập nhật không thành công. Vui lòng kiểm tra định dạng ngày sinh và dạng gửi (multipart/form-data).");
      alert("Cập nhật không thành công. Kiểm tra lại ngày sinh (YYYY-MM-DD) và dạng gửi.");
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // HELPERS: USERS & CARS
  // =========================
  const fetchAllUsers = async () => {
    try {
      const r = await api.get("/User");
      return Array.isArray(r.data) ? r.data : (r.data ? [r.data] : []);
    } catch (e) {
      console.error("fetchAllUsers error:", e);
      return [];
    }
  };

  const resolveCarUserId = async (carId, uid) => {
    try {
      const r = await api.get(`/users/${uid}/cars`);
      const arr = Array.isArray(r.data) ? r.data : (r.data ? [r.data] : []);
      const found = arr.find((it) => Number(it?.carId ?? it?.id) === Number(carId));
      if (!found) return null;
      return Number(found?.carUserId ?? found?.CarUserId ?? found?.id);
    } catch {
      return null;
    }
  };

  const getUsersByCar = async (carId) => {
    try {
      const all = await fetchAllUsers();
      if (!all.length) return [];
      const limit = 8, userIds = [];
      const chunks = [];
      for (let i = 0; i < all.length; i += limit) chunks.push(all.slice(i, i + limit));

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
            } catch { return null; }
          })
        );
        results.forEach((uid) => { if (uid) userIds.push(uid); });
      }
      return userIds;
    } catch (e) {
      console.error("getUsersByCar error:", e);
      return [];
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
      return { id: uid, name: `User #${uid}`, email: '', phone: '' };
    }
  };

  // =========================
  // GROUP MAP (carId -> group)
  // =========================
  const [groupsMap, setGroupsMap] = useState(new Map());
  useEffect(() => {
    if (activeTab !== "vehicles") return;
    let aborted = false;

    (async () => {
      try {
        const gRes = await api.get("/Group");
        const arr = Array.isArray(gRes?.data) ? gRes.data : [];
        const map = new Map();
        for (const g of arr) {
          const cid = K(g.carId ?? g.CarId ?? g.vehicleId);
          if (cid) map.set(cid, g);
        }
        if (!aborted) setGroupsMap(map);
      } catch (e) {
        console.warn("Không tải được Group:", e);
        if (!aborted) setGroupsMap(new Map());
      }
    })();

    return () => { aborted = true; };
  }, [activeTab]);

  // =========================
  // VEHICLES OF CURRENT USER
  // =========================
  const [vehicleData, setVehicleData] = useState([]);

  useEffect(() => {
    if (activeTab !== "vehicles" || !userId) return;
    let mounted = true;
    setLoading(true);

    (async () => {
      try {
        const res = await api.get(`/users/${userId}/cars`);
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

        const mapped = await Promise.all(
          (list || [])
            .filter(Boolean)
            .map(async (it) => {
              const carId = it.carId ?? it._carId ?? it.id ?? it.Id ?? null;

              const g = carId ? groupsMap.get(K(carId)) : null;
              const groupId = g?.id ?? g?.groupId ?? null;
              const groupName = g?.name ?? g?.groupName ?? (g ? `Nhóm #${g.id ?? g.groupId}` : "Chưa có nhóm");

              let memberCount = 1;
              if (carId) {
                try {
                  const ownerIds = await getUsersByCar(carId);
                  memberCount = ownerIds?.length ? ownerIds.length : 1;
                } catch (e) {
                  console.error(`Lỗi khi lấy số thành viên cho xe ${carId}:`, e);
                }
              }

              return {
                id: carId,
                carUserId:
                  it.carUserId ?? it.CarUserId ?? it.carUser?.id ?? it.linkId ?? null,
                vehicleName: it.carName ?? it.name ?? it.VehicleName ?? it.vehicleName ?? "",
                licensePlate: it.plateNumber ?? it.plate ?? it.PlateNumber ?? it.licensePlate ?? "",
                purchaseDate: it.purchaseDate ?? it.PurchaseDate ?? it.createdAt ?? null,
                status: it.status ?? it.Status ?? "Active",
                insurance: it.insurance ?? it.Insurance ?? {
                  provider: "", policyNumber: "", startDate: null, endDate: null,
                  premium: 0, monthlyPayment: 0, nextPayment: null, status: "Active"
                },
                ownershipPercentage: it.ownershipPercentage != null ? Number(it.ownershipPercentage) : 100,
                memberCount,
                groupId,
                groupName,
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

    return () => { mounted = false; };
  }, [activeTab, userId, groupsMap]);

  // =========================
  // GROUP ACTIVITIES = FORMS (API wired)
  // =========================
  const [activities, setActivities] = useState([]);         // [{id,title,yes,no,status,hasVoted,...}]
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [showCreateActivity, setShowCreateActivity] = useState(false);
  const [newActivity, setNewActivity] = useState({ title: "", description: "" });
  const [votingActivity, setVotingActivity] = useState(null);

  const isMember = userRole === 0 || userRole === "0" || Number(userRole) === 0;
  const isAdmin = userRole === 1 || userRole === "1" || Number(userRole) === 1;
  const isStaff = userRole === 2 || userRole === "2" || Number(userRole) === 2;
  const isAdminOrStaff = isAdmin || isStaff;

  const patchActivity = (formId, patchOrProducer) => {
    setActivities(prev =>
      prev.map(a => {
        if (a.id !== formId) return a;
        const base = { ...a };
        const patch = typeof patchOrProducer === 'function' ? patchOrProducer(base) : patchOrProducer;
        return { ...base, ...patch };
      })
    );
  };

  // GET /Form -> filter theo groupId, sau đó nạp kết quả từng form
  const loadActivities = async (gid) => {
    setLoadingActivities(true);
    try {
      const r = await api.get("/Form");
      const list = Array.isArray(r?.data) ? r.data : [];

      const filtered = list
        .filter(f => Number(f.groupId) === Number(gid))
        .map(f => ({
          id: f.formId ?? f.id,
          title: f.formTitle ?? f.title ?? `Form #${f.formId ?? f.id}`,
          description: "",
          status: "Pending",
          yes: 0,
          no: 0,
          hasVoted: false,
          startDate: f.startDate,
          endDate: f.endDate,
          groupId: f.groupId,
        }));

      setActivities(filtered);

      await Promise.all(
        filtered.map(async (a) => {
          try {
            const rs = await api.get(`/Form/${a.id}/results`);
            const d = rs?.data ?? {};
            const yes = Number(d.agreeVotes ?? 0);
            const no  = Number(d.disagreeVotes ?? 0);
            const status = d.endDate && new Date(d.endDate) < new Date() ? "Closed" : "Pending";
            patchActivity(a.id, { yes, no, status });
          } catch {}
        })
      );
    } catch (e) {
      console.error("loadActivities error:", e);
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Tạo form -> POST /Form, rồi leader auto-vote đồng ý
  const createActivity = async (gid) => {
    const title = newActivity.title?.trim();
    if (!title) { alert("Nhập tiêu đề yêu cầu"); return; }

    const payload = {
      groupId: Number(gid),
      formTitle: title,
      startDate: nowIso(),
      endDate: addDaysIso(7),
    };

    try {
      const r = await api.post("/Form", payload);
      const created = r?.data ?? {};
      const newId = created.formId ?? created.id ?? Date.now();

      // thêm tạm
      setActivities(prev => ([
        {
          id: newId,
          title,
          description: newActivity.description?.trim() || "",
          status: "Pending",
          yes: 0,
          no: 0,
          hasVoted: false,
          startDate: created.startDate ?? payload.startDate,
          endDate: created.endDate ?? payload.endDate,
          groupId: created.groupId ?? gid,
        },
        ...prev,
      ]));

      // leader auto vote = agree
      await api.post("/Vote", {
        userId: Number(userId),
        formId: Number(newId),
        decision: true,
      });

      // optimistic + đánh dấu đã vote cho leader
      patchActivity(newId, prev => ({
        yes: (prev?.yes ?? 0) + 1,
        hasVoted: true,
      }));

      // đồng bộ lại số liệu từ BE
      await refreshFormResults(newId);

      setShowCreateActivity(false);
      setNewActivity({ title: "", description: "" });
    } catch (e) {
      console.error("create form error:", e);
      alert("Tạo yêu cầu thất bại.");
    }
  };

  // GET /Form/{id}/results
  const refreshFormResults = async (formId) => {
    try {
      const r = await api.get(`/Form/${formId}/results`);
      const d = r?.data ?? {};
      const yes = Number(d.agreeVotes ?? 0);
      const no  = Number(d.disagreeVotes ?? 0);
      const status = d.endDate && new Date(d.endDate) < new Date() ? "Closed" : "Pending";
      patchActivity(formId, { yes, no, status });
    } catch (e) {
      console.warn("refresh results error:", e);
    }
  };

  // =========================
  // DELETE FORM (Leader only)
  // =========================
  const [deletingId, setDeletingId] = useState(null);

  // DELETE /Form/{id}/delete  (không prefix /api)
  const deleteActivity = async (activityId) => {
    if (!activityId) return;
    const isLeader = groupLeaderId && Number(userId) === Number(groupLeaderId);
    if (!isLeader) {
      alert("Chỉ trưởng nhóm mới được xóa form.");
      return;
    }

    if (!confirm("Bạn chắc chắn muốn xóa form này? Hành động không thể hoàn tác.")) return;

    try {
      setDeletingId(activityId);
      await api.delete(`/Form/${activityId}/delete`);
      setActivities(prev => prev.filter(a => a.id !== activityId));
      alert("Đã xóa form thành công.");
    } catch (e) {
      console.error("delete form error:", e);
      alert("Xóa form thất bại. Vui lòng thử lại.");
    } finally {
      setDeletingId(null);
    }
  };

  // POST /Vote – cho phép leader & member vote 1 lần
  const voteActivity = async (activityId, agree) => {
    try {
      const cur = activities.find(a => a.id === activityId);
      if (cur?.hasVoted) return;

      await api.post("/Vote", {
        userId: Number(userId),
        formId: Number(activityId),
        decision: !!agree,
      });

      // optimistic
      patchActivity(activityId, prev => ({
        yes: (prev?.yes ?? 0) + (agree ? 1 : 0),
        no:  (prev?.no ?? 0)  + (!agree ? 1 : 0),
        hasVoted: true,
      }));

      await refreshFormResults(activityId);
    } catch (e) {
      console.error("vote error:", e);
      alert("Gửi phiếu bầu không thành công.");
    } finally {
      setVotingActivity(null);
    }
  };

  // =========================
  // VIEW GROUP (CO-OWNERS + LEADER + ACTIVITIES)
  // =========================
  const handleViewCoOwners = async (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowCoOwnersModal(true);
    setLoadingCoOwners(true);
    setCoOwnersData([]);
    setGroupInfo(null);
    setActivities([]);
    setGroupLeaderId(null);

    try {
      const carId = vehicle.id || vehicle.carId;
      if (!carId) {
        alert('Không tìm thấy thông tin xe.');
        setLoadingCoOwners(false);
        return;
      }

      // group
      const g = groupsMap.get(K(carId));
      if (g) {
        setGroupInfo(g);
        if (g.id || g.groupId) await loadActivities(g.id ?? g.groupId);
      } else {
        try {
          const groupRes = await api.get('/Group');
          const groups = Array.isArray(groupRes.data) ? groupRes.data : [];
          const group = groups.find(x => Number(x.carId) === Number(carId));
          if (group) {
            setGroupInfo(group);
            if (group.id || group.groupId) await loadActivities(group.id ?? group.groupId);
          }
        } catch (e) { console.error('Lỗi khi lấy thông tin nhóm:', e); }
      }

      // owners
      const ownerIds = await getUsersByCar(carId);
      if (!ownerIds || ownerIds.length === 0) {
        setCoOwnersData([]);
        setLoadingCoOwners(false);
        return;
      }

      const ownersWithInfo = await Promise.all(
        ownerIds.map(async (uid) => {
          const userInfo = await getUserInfo(uid);
          let percentage = 0;
          try {
            const userCarsRes = await api.get(`/users/${uid}/cars`);
            const userCars = Array.isArray(userCarsRes.data) ? userCarsRes.data : [];
            const carMatch = userCars.find(c => Number(c.carId ?? c.id) === Number(carId));
            if (carMatch && carMatch.ownershipPercentage != null) {
              percentage = Number(carMatch.ownershipPercentage);
            }
          } catch {}
          const cuid = await resolveCarUserId(carId, uid);
          return { ...userInfo, carUserId: cuid, percentage: percentage || 0 };
        })
      );

      if (ownersWithInfo.every(o => o.percentage === 0) && ownersWithInfo.length > 0) {
        const equalPercent = Math.floor(100 / ownersWithInfo.length);
        const remainder = 100 - (equalPercent * ownersWithInfo.length);
        ownersWithInfo.forEach((o, idx) => { o.percentage = equalPercent + (idx === 0 ? remainder : 0); });
      }

      ownersWithInfo.sort((a, b) => (b.percentage || 0) - (a.percentage || 0));
      setCoOwnersData(ownersWithInfo);

      // leader = highest percentage
      if (ownersWithInfo.length) setGroupLeaderId(ownersWithInfo[0].id);
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
    setActivities([]);
    setGroupLeaderId(null);
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

  // =========================
  // RENDER
  // =========================
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
            </>
          )}
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <>
            {loading && <div className="mb-4 text-sm text-gray-600">Đang tải thông tin...</div>}
            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left - ID Card */}
              <div className="border-indigo-100 shadow-lg lg:col-span-1 rounded-lg border p-4 bg-white">
                <div className="pb-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-indigo-900">Ảnh căn cước</div>
                  <div className="text-sm text-gray-500">Tải lên ảnh mặt trước và mặt sau</div>
                </div>
                <div className="space-y-4">
                  {/* Front */}
                  <div className="space-y-2">
                    <label className="text-sm text-slate-700">Mặt trước</label>
                    <div className="relative group">
                      {idCardFront ? (
                        <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden border-2 border-indigo-200 shadow-md">
                          <img src={idCardFront} alt="ID Card Front" className="w-full h-full object-cover" />
                          <button
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
                  {/* Back */}
                  <div className="space-y-2">
                    <label className="text-sm text-slate-700">Mặt sau</label>
                    <div className="relative group">
                      {idCardBack ? (
                        <div className="relative w-full aspect-[3/2] rounded-lg overflow-hidden border-2 border-indigo-200 shadow-md">
                          <img src={idCardBack} alt="ID Card Back" className="w-full h-full object-cover" />
                          <button
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

              {/* Right - Profile form */}
              <div className="border-indigo-100 shadow-lg lg:col-span-2 rounded-lg border p-4 bg-white">
                <div className="pb-4">
                  <div className="flex items-center gap-2 text-lg font-semibold text-indigo-900">Thông tin cá nhân</div>
                  <div className="text-sm text-gray-500">Cập nhật thông tin tài khoản của bạn</div>
                </div>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Họ và tên <span className="text-red-500">*</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Email <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={user.email} readOnly className="w-full px-4 py-2.5 border border-slate-300 rounded-lg bg-slate-50 cursor-not-allowed" />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Nhập số điện thoại" />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Giới tính</label>
                      <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                        <option value="">-- Chọn --</option>
                        <option value="Male">Nam</option>
                        <option value="Female">Nữ</option>
                        <option value="Other">Khác</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Ngày sinh <span className="text-red-500">*</span></label>
                      <input type="date" name="dob" value={form.dob} onChange={handleChange} max={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm text-slate-700">Bằng lái xe</label>
                      <input type="text" name="licenseNumber" value={form.licenseNumber} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" placeholder="Nhập số bằng lái xe" />
                    </div>
                  </div>

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

        {/* VEHICLES TAB */}
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
                  const modelMatch = vehicle.vehicleName?.match(/(VF\d+|VF-\d+)/i);
                  const modelName = modelMatch ? modelMatch[1].toUpperCase() : vehicle.vehicleName?.split(' ').pop() || 'Xe';
                  return (
                    <div key={vehicle.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">{modelName}</h3>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div>
                          <span className="text-sm text-gray-600">Nhóm:</span>
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            {vehicle.groupName || "Chưa có nhóm"}
                          </div>
                        </div>

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
                          <span className="text-sm text-gray-600">Phần của bạn:</span>
                          <div className="text-sm font-medium text-gray-900 mt-1">
                            {vehicle.ownershipPercentage || 0}%
                          </div>
                        </div>
                      </div>

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

        {/* INSURANCE TAB */}
        {activeTab === "insurance" && (
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl-grid-cols-3 gap-6 mb-8">
              {vehicleData.map((vehicle) => (
                <div key={vehicle.id} className="bg-white border border-indigo-200 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-indigo-900">{vehicle.vehicleName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        vehicle.insurance.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {vehicle.insurance.status === "Active" ? "Hoạt động" : "Hết hạn"}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Nhà bảo hiểm:</span>
                        <span className="text-sm font-medium text-gray-900">{vehicle.insurance.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Số hợp đồng:</span>
                        <span className="text-sm font-medium text-gray-900">{vehicle.insurance.policyNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Loại bảo hiểm:</span>
                        <span className="text-sm font-medium text-gray-900">{vehicle.insurance.coverage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phí bảo hiểm/năm:</span>
                        <span className="text-sm font-bold text-indigo-900">
                          {Number(vehicle.insurance.premium || 0).toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Phần của bạn:</span>
                        <span className="text-sm font-bold text-red-600">
                          {Math.round(Number(vehicle.insurance.monthlyPayment || 0) * Number(vehicle.ownershipPercentage || 0) / 100).toLocaleString("vi-VN")} VNĐ
                        </span>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Hạn thanh toán tiếp:</span>
                        <span className="font-medium text-gray-900">
                          {vehicle.insurance.nextPayment ? new Date(vehicle.insurance.nextPayment).toLocaleDateString("vi-VN") : '—'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Hiệu lực:</span>
                        <span className="font-medium text-gray-900">
                          {vehicle.insurance.startDate ? new Date(vehicle.insurance.startDate).toLocaleDateString("vi-VN") : '—'} - {vehicle.insurance.endDate ? new Date(vehicle.insurance.endDate).toLocaleDateString("vi-VN") : '—'}
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

        {/* CO-OWNERS MODAL */}
        {showCoOwnersModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto" style={{ maxWidth: '680px' }}>
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
                        {groupInfo?.name ?? groupInfo?.groupName ?? (selectedVehicle.groupName || "—")}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedVehicle.vehicleName || "---"} • {selectedVehicle.licensePlate || "---"}
                      </p>
                    </div>
                  </div>
                  <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Members */}
                {loadingCoOwners ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <div className="border-b border-gray-200 pb-3 mb-4 flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-gray-900">Thành viên</h4>
                        {groupLeaderId && (
                          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-800" />
                        )}
                      </div>

                      {coOwnersData.length === 0 ? (
                        <p className="text-gray-500 text-sm">Chưa có thông tin thành viên.</p>
                      ) : (
                        <>
                          <div className="grid grid-cols-3 gap-4 mb-3 text-sm font-medium text-gray-600">
                            <div className="col-span-2">Thành viên</div>
                            <div className="text-right">% Sở hữu</div>
                          </div>

                          <div className="space-y-3 mb-4">
                            {coOwnersData.map((owner, index) => {
                              const isCurrentUser = userId && Number(owner.id) === Number(userId);
                              const isLeader = groupLeaderId && Number(owner.id) === Number(groupLeaderId);
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
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-gray-900">
                                        {isCurrentUser ? 'Bạn' : owner.name}
                                      </span>
                                      {isLeader && (
                                        <span className="text-[10px] px-2 py-[2px] rounded bg-yellow-100 text-yellow-800">
                                          Trưởng nhóm
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-24 bg-gray-2 00 rounded-full h-2">
                                      <div className={`h-2 rounded-full ${isCurrentUser ? 'bg-purple-500' : 'bg-gray-400'}`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-right">
                                      {percentage}%
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

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

                    {/* Group Activities (Forms) */}
                    <div>
                      <div className="border-b border-gray-200 pb-3 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <h4 className="text-lg font-semibold text-gray-900">Hoạt động nhóm</h4>
                        </div>

                        {/* Only leader can create new requests */}
                        {groupInfo && groupLeaderId && Number(userId) === Number(groupLeaderId) && (
                          <button
                            onClick={() => setShowCreateActivity(true)}
                            className="text-sm px-3 py-1.5 rounded bg-indigo-600 text-white hover:bg-indigo-700"
                          >
                            Tạo yêu cầu
                          </button>
                        )}
                      </div>

                      {loadingActivities ? (
                        <div className="text-sm text-gray-500">Đang tải hoạt động...</div>
                      ) : activities.length === 0 ? (
                        <div className="text-sm text-gray-500">Chưa có hoạt động nào.</div>
                      ) : (
                        <div className="space-y-3">
                          {activities.map((a) => (
                            <div key={a.id} className="border rounded-lg p-3 flex items-start justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{a.title}</div>
                                {a.description && <div className="text-sm text-gray-600 mt-1">{a.description}</div>}
                                <div className="text-xs text-gray-500 mt-2">
                                  Trạng thái: <span className="font-medium">{a.status || 'Pending'}</span> •{' '}
                                  Đồng ý: <b>{a.yes ?? 0}</b> • Không đồng ý: <b>{a.no ?? 0}</b>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {/* Vote */}
                                {!a.hasVoted ? (
                                  <button
                                    onClick={() => setVotingActivity(a)}
                                    className="text-xs px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700"
                                  >
                                    Vote
                                  </button>
                                ) : (
                                  <span className="text-xs px-3 py-1.5 rounded bg-green-50 text-green-700">Đã vote</span>
                                )}

                                {/* Xóa – chỉ leader */}
                                {groupLeaderId && Number(userId) === Number(groupLeaderId) && (
                                  <button
                                    onClick={() => deleteActivity(a.id)}
                                    disabled={deletingId === a.id}
                                    className="text-xs px-3 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 disabled:opacity-60"
                                    title="Xóa form"
                                  >
                                    {deletingId === a.id ? "Đang xóa..." : "Xóa"}
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contract button */}
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
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* AGREEMENT MODAL */}
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
                    <button onClick={() => setShowAgreementModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
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
                        <p>Các bên tham gia hợp đồng sở hữu xe có quyền và nghĩa vụ theo tỷ lệ phần trăm sở hữu đã cam kết. Mọi quyết định liên quan đến việc sử dụng, bảo dưỡng, hoặc chuyển nhượng xe phải được sự đồng ý của tất cả các bên.</p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">2. Trách nhiệm tài chính</h4>
                        <p>Các chi phí liên quan đến xe bao gồm bảo hiểm, bảo dưỡng, sửa chữa, và phí đăng kiểm sẽ được phân bổ theo tỷ lệ sở hữu. Mọi thành viên có nghĩa vụ đóng góp đầy đủ và đúng hạn các khoản chi phí đã thỏa thuận.</p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">3. Sử dụng và bảo quản xe</h4>
                        <p>Xe phải được sử dụng đúng mục đích và tuân thủ luật giao thông. Các bên có trách nhiệm bảo quản xe cẩn thận, không cho thuê hoặc chuyển nhượng quyền sử dụng cho bên thứ ba mà không có sự đồng ý bằng văn bản của tất cả các bên.</p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">4. Giải quyết tranh chấp</h4>
                        <p>Mọi tranh chấp phát sinh trong quá trình thực hiện hợp đồng sẽ được giải quyết thông qua thương lượng hòa giải. Trường hợp không đạt được thỏa thuận, tranh chấp sẽ được đưa ra cơ quan pháp luật có thẩm quyền giải quyết.</p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">5. Chấm dứt hợp đồng</h4>
                        <p>Hợp đồng có thể chấm dứt khi xe được bán hoặc khi tất cả các bên đồng ý chấm dứt bằng văn bản. Trong trường hợp chấm dứt hợp đồng, các bên sẽ thanh toán các khoản chi phí còn tồn đọng và phân chia tài sản theo tỷ lệ sở hữu.</p>
                      </div>
                      <div>
                        <h4 className="text-gray-900 mb-1 font-bold uppercase">6. Điều khoản khác</h4>
                        <p>Mọi sửa đổi, bổ sung hợp đồng phải được lập thành văn bản và có chữ ký của tất cả các bên. Hợp đồng này được lập thành nhiều bản có giá trị pháp lý như nhau, mỗi bên giữ một bản.</p>
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

        {/* INSURANCE DETAIL MODAL (reserved) */}
        {showInsuranceModal && selectedVehicle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-indigo-900">
                    Chi tiết bảo hiểm - {selectedVehicle.vehicleName}
                  </h3>
                  <button onClick={closeInsuranceModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CREATE ACTIVITY MODAL (Leader only) */}
        {showCoOwnersModal && showCreateActivity && groupInfo && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5">
              <h4 className="text-lg font-semibold mb-4">Tạo yêu cầu mới</h4>
              <div className="space-y-3">
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Tiêu đề (formTitle)"
                  value={newActivity.title}
                  onChange={(e) => setNewActivity(s => ({ ...s, title: e.target.value }))}
                />
                <textarea
                  rows={4}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Mô tả (hiển thị nội bộ UI)"
                  value={newActivity.description}
                  onChange={(e) => setNewActivity(s => ({ ...s, description: e.target.value }))}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button className="px-3 py-2 rounded bg-gray-100" onClick={() => setShowCreateActivity(false)}>Huỷ</button>
                  <button className="px-3 py-2 rounded bg-indigo-600 text-white" onClick={() => createActivity(groupInfo.id ?? groupInfo.groupId)}>Tạo</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VOTE MODAL */}
        {showCoOwnersModal && votingActivity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-5">
              <h4 className="text-lg font-semibold mb-2">Vote cho yêu cầu</h4>
              <div className="font-medium text-gray-900">{votingActivity.title}</div>
              {votingActivity.description && <div className="text-sm text-gray-600 mt-2">{votingActivity.description}</div>}
              <div className="flex justify-end gap-2 pt-4">
                <button className="px-3 py-2 rounded bg-gray-100" onClick={() => setVotingActivity(null)}>Đóng</button>
                <button className="px-3 py-2 rounded bg-rose-600 text-white" onClick={() => voteActivity(votingActivity.id, false)}>Không đồng ý</button>
                <button className="px-3 py-2 rounded bg-green-600 text-white" onClick={() => voteActivity(votingActivity.id, true)}>Đồng ý</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

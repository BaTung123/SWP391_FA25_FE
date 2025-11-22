import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/header";
import api from "../../config/axios";

const RegistercarPage = () => {
  // ================== STATE ==================
  const [me, setMe] = useState(null); // {userId/...}
  const [cars, setCars] = useState([]);
  const [carUserMap, setCarUserMap] = useState({}); // { [carId]: myCarUserId }
  const [ownershipMap, setOwnershipMap] = useState({}); // { [carId]: % của tôi }
  const [formData, setFormData] = useState({ vehicleId: "" });
  const [userNameCache, setUserNameCache] = useState(new Map());

  // Calendar
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateForTime, setSelectedDateForTime] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  // Lịch
  const [mySlotsByDate, setMySlotsByDate] = useState({});
  const [othersSlotsByDate, setOthersSlotsByDate] = useState({});
  const [newSlots, setNewSlots] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ================== DATE HELPERS ==================
  const toLocalDateKey = (d) => {
    if (!(d instanceof Date)) d = new Date(d);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };
  // local ISO "YYYY-MM-DDTHH:mm:ss" (không Z)
  const toLocalIso = (d) => {
    const t = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return t.toISOString().slice(0, 19);
  };

  // ================== MISC HELPERS ==================
  const hmToMin = (hm) => {
    const [h, m] = (hm || "00:00").split(":").map(Number);
    return h * 60 + m;
  };
  const duration = (s, e) => (hmToMin(e) - hmToMin(s)) / 60;
  const overlap = (a, b) =>
    hmToMin(a.startTime) < hmToMin(b.endTime) &&
    hmToMin(b.startTime) < hmToMin(a.endTime);

  const maxDaily = () => {
    const carId = Number(formData.vehicleId);
    const percent = ownershipMap[carId] ?? 100;
    return (percent / 100) * 24;
  };

  const monthNames = useMemo(
    () => [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    []
  );
  const dayNames = useMemo(() => ["CN", "T2", "T3", "T4", "T5", "T6", "T7"], []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  const isPastDate = (day) => {
    if (!day) return false;
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };
  const isToday = (day) => {
    if (!day) return false;
    const t = new Date();
    return (
      day === t.getDate() &&
      currentDate.getMonth() === t.getMonth() &&
      currentDate.getFullYear() === t.getFullYear()
    );
  };
  const isSelected = (day) => {
    if (!day) return false;
    const k = toLocalDateKey(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
    return selectedDates.includes(k);
  };

  // ================== BOOT ==================
  const getMe = async () => {
    try {
      const s = localStorage.getItem("user");
      if (s) return JSON.parse(s);
    } catch {}
    const r = await api.get("/Auth/me").catch(() => null);
    return r?.data?.data || r?.data || null;
  };

  useEffect(() => {
    const boot = async () => {
      try {
        setLoading(true);
        const me0 = await getMe();
        if (!me0) throw new Error("Bạn chưa đăng nhập.");
        const userId = me0.userId ?? me0.id ?? me0.Id;
        setMe({ ...me0, _id: userId });

        // Xe tôi sở hữu
        const r = await api.get(`/users/${userId}/cars`);
        const arr = Array.isArray(r.data) ? r.data : r.data?.data || [];
        const mapped = arr
          .map((it) => {
            const carId = it.carId ?? it.id ?? it.CarId ?? it.Id;
            const carUserId =
              it.carUserId ??
              it.CarUserId ??
              it.carUser?.id ??
              it.carUser?.carUserId ??
              it.linkId ??
              it.CarUserLinkId ??
              null;

            // Chuẩn hoá status -> 1 (Hoạt động) | 0 (Không hoạt động)
            const rawStatus =
              it.status ?? it.Status ?? it.isActive ?? it.IsActive ?? 1;
            const status =
              typeof rawStatus === "boolean" ? (rawStatus ? 1 : 0) : Number(rawStatus);

            return {
              _carId: carId,
              _carUserId: carUserId,
              carName: it.carName ?? it.name ?? it.CarName,
              brand: it.brand ?? it.Brand,
              plateNumber: it.plateNumber ?? it.PlateNumber,
              color: it.color ?? it.Color,
              image: it.image ?? it.Image,
              status, // <--- quan trọng
            };
          })
          .filter((x) => x._carId != null);

        setCars(mapped);

        // Map carId -> myCarUserId
        const cuMap = {};
        mapped.forEach((c) => {
          if (c._carUserId != null) cuMap[c._carId] = c._carUserId;
        });
        setCarUserMap(cuMap);

        // % sở hữu
        const pos = await api.get("/PercentOwnership").catch(() => ({ data: [] }));
        const listPO = Array.isArray(pos.data) ? pos.data : pos.data?.data || [];
        const percentMap = {};
        listPO.forEach((p) => {
          percentMap[Number(p.carUserId ?? p.CarUserId)] = Number(
            p.percentage ?? p.Percentage ?? 0
          );
        });
        const ownMap = {};
        mapped.forEach((c) => {
          ownMap[c._carId] = percentMap[c._carUserId] ?? 100;
        });
        setOwnershipMap(ownMap);

        // Chọn xe đầu tiên (hoặc xe đang hoạt động nếu có)
        if (mapped.length) {
          const firstActive = mapped.find((c) => Number(c.status) === 1) ?? mapped[0];
          const firstId = firstActive._carId;
          setFormData((s) => ({ ...s, vehicleId: firstId }));
          await loadSchedulesForCar(firstId, me0, cuMap);
        }
      } catch (e) {
        console.error(e);
        setErrorMsg(e?.message || "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, []);

  // ================== NORMALIZE & LOAD ==================
  const confirmNewSlots = async () => {
    try {
      if (!formData.vehicleId) return alert("Vui lòng chọn xe trước.");
      if (!selectedDateForTime) return;
      if (newSlots.length === 0) return alert("Vui lòng thêm khung giờ.");

      // min/max cho từng slot
      for (let i = 0; i < newSlots.length; i++) {
        const d = duration(newSlots[i].startTime, newSlots[i].endTime);
        if (d <= 0) return alert(`Khung giờ ${i + 1} chưa hợp lệ`);
        if (d < 1) return alert(`Khung giờ ${i + 1} tối thiểu 1 giờ`);
        if (d > maxDaily())
          return alert(`Khung giờ ${i + 1} vượt quá ${maxDaily()}h/ngày`);
      }

      const k = toLocalDateKey(selectedDateForTime);
      const myToday = mySlotsByDate[k] || [];
      const myUsed = myToday.reduce(
        (t, s) => t + duration(s.startTime, s.endTime),
        0
      );
      const remain = Math.max(0, maxDaily() - myUsed);
      const newSum = newSlots.reduce(
        (t, s) => t + duration(s.startTime, s.endTime),
        0
      );
      if (newSum > remain)
        return alert(
          `Bạn còn ${remain.toFixed(2)}h trong ngày (đã dùng ${myUsed.toFixed(
            2
          )}h).`
        );

      // tránh trùng với tôi
      for (const ns of newSlots) {
        for (const ms of myToday) {
          if (overlap(ns, ms)) {
            return alert(
              `Trùng lịch của bạn: ${ns.startTime}–${ns.endTime} vs ${ms.startTime}–${ms.endTime}`
            );
          }
        }
      }
      // Khoảng cách tối thiểu 1 giờ với lịch của tôi
      for (const ns of newSlots) {
        for (const ms of myToday) {
          const nsStart = hmToMin(ns.startTime);
          const nsEnd = hmToMin(ns.endTime);
          const msStart = hmToMin(ms.startTime);
          const msEnd = hmToMin(ms.endTime);
          const gap = nsEnd <= msStart ? msStart - nsEnd : nsStart >= msEnd ? nsStart - msEnd : 0;
          if (gap < 60) {
            return alert(
              `Các khung giờ phải cách nhau tối thiểu 1 giờ: ${ns.startTime}–${ns.endTime} vs ${ms.startTime}–${ms.endTime}`
            );
          }
        }
      }
      // tránh trùng với đồng sở hữu
      const othersToday = othersSlotsByDate[k] || [];
      for (const ns of newSlots) {
        for (const os of othersToday) {
          if (overlap(ns, os)) {
            return alert(
              `Trùng lịch đồng sở hữu: ${ns.startTime}–${ns.endTime} vs ${os.startTime}–${os.endTime}`
            );
          }
        }
      }
      // Khoảng cách tối thiểu 1 giờ với lịch đồng sở hữu
      for (const ns of newSlots) {
        for (const os of othersToday) {
          const nsStart = hmToMin(ns.startTime);
          const nsEnd = hmToMin(ns.endTime);
          const osStart = hmToMin(os.startTime);
          const osEnd = hmToMin(os.endTime);
          const gap = nsEnd <= osStart ? osStart - nsEnd : nsStart >= osEnd ? nsStart - osEnd : 0;
          if (gap < 60) {
            return alert(
              `Các khung giờ phải cách nhau tối thiểu 1 giờ với đồng sở hữu: ${ns.startTime}–${ns.endTime} vs ${os.startTime}–${os.endTime}`
            );
          }
        }
      }

      // Khoảng cách tối thiểu 1 giờ giữa các khung giờ mới của bạn
      const sortedNew = newSlots
        .slice()
        .sort((a, b) => hmToMin(a.startTime) - hmToMin(b.startTime));
      for (let i = 1; i < sortedNew.length; i++) {
        const prev = sortedNew[i - 1];
        const curr = sortedNew[i];
        const gap = hmToMin(curr.startTime) - hmToMin(prev.endTime);
        if (gap < 60) {
          return alert(
            `Các khung giờ mới phải cách nhau tối thiểu 1 giờ: ${prev.startTime}–${prev.endTime} và ${curr.startTime}–${curr.endTime}`
          );
        }
      }

      const carId = Number(formData.vehicleId);
      const myCarUserId = carUserMap[carId];
      if (!myCarUserId)
        return alert("Không tìm thấy carUserId của bạn trên xe này.");

      const created = [];
      for (const slot of newSlots) {
        const [sh, sm] = slot.startTime.split(":").map(Number);
        const [eh, em] = slot.endTime.split(":").map(Number);
        const start = new Date(
          selectedDateForTime.getFullYear(),
          selectedDateForTime.getMonth(),
          selectedDateForTime.getDate(),
          sh,
          sm,
          0,
          0
        );
        const end = new Date(
          selectedDateForTime.getFullYear(),
          selectedDateForTime.getMonth(),
          selectedDateForTime.getDate(),
          eh,
          em,
          0,
          0
        );

        const body = {
          carUserId: myCarUserId,
          startDate: toLocalIso(start),
          endDate: toLocalIso(end),
          status: 0,
        };
        const res = await api.post("/Schedule", body);
        const saved = res?.data?.data || res?.data || {};
        created.push({
          startTime: slot.startTime,
          endTime: slot.endTime,
          id:
            saved.id ??
            saved.scheduleId ??
            saved.Id ??
            saved.ScheduleId ??
            null,
          ownerCarUserId: myCarUserId,
          ownerUserId: me?._id,
        });
      }

      setMySlotsByDate((prev) => ({
        ...prev,
        [k]: [...(prev[k] || []), ...created],
      }));
      setSelectedDates((p) => (p.includes(k) ? p : [...p, k]));
      setNewSlots([]);

      await loadSchedulesForCar(carId);
      alert("Đặt lịch thành công.");
    } catch (e) {
      console.error(e);
      alert("Không thể lưu lịch. Vui lòng thử lại.");
    }
  };
  const normalizeSchedule = (item) => {
    const deleted =
      item?.deleteAt ||
      item?.deletedAt ||
      item?.DeleteAt ||
      item?.DeletedAt ||
      item?.isDeleted ||
      item?.IsDeleted ||
      item?.deleted ||
      item?.Deleted ||
      item?.status === -1 ||
      item?.Status === -1;
    if (deleted) return null;

    const start = new Date(item.startDate ?? item.StartDate);
    const end = new Date(item.endDate ?? item.EndDate);
    const key = toLocalDateKey(start);

    const startTime = `${String(start.getHours()).padStart(2, "0")}:${String(
      start.getMinutes()
    ).padStart(2, "0")}`;
    const endTime = `${String(end.getHours()).padStart(2, "0")}:${String(
      end.getMinutes()
    ).padStart(2, "0")}`;

    return {
      key,
      startTime,
      endTime,
      id:
        item.id ??
        item.scheduleId ??
        item.ScheduleId ??
        item.Id ??
        item.scheduleID ??
        item.ScheduleID ??
        null,
      ownerCarUserId: item.carUserId ?? item.CarUserId ?? null,
      ownerUserId: item.userId ?? item.UserId ?? null,
      carId: item.carId ?? item.CarId ?? null,
      ownerName: item.userName ?? item.fullName ?? item.FullName,
    };
  };

  const loadSchedulesForCar = async (carId, me0 = me, cuMap0 = carUserMap) => {
    try {
      const myCarUserId = cuMap0[carId];
      const userId = me0.userId ?? me0.id ?? me0.Id;

      // Lịch của TÔI
      const rMy = await api.get(`/Schedule/user/${userId}`).catch(() => ({ data: [] }));
      const rawMy = Array.isArray(rMy.data) ? rMy.data : rMy.data?.data || [];
      const normMy = rawMy
        .map(normalizeSchedule)
        .filter(Boolean)
        .filter(
          (s) =>
            (myCarUserId ? Number(s.ownerCarUserId) === Number(myCarUserId) : true) &&
            (s.carId ? Number(s.carId) === Number(carId) : true)
        );

      const myGrouped = {};
      normMy.forEach((s) => {
        if (!myGrouped[s.key]) myGrouped[s.key] = [];
        myGrouped[s.key].push({
          startTime: s.startTime,
          endTime: s.endTime,
          id: s.id,
          ownerCarUserId: s.ownerCarUserId,
          ownerUserId: s.ownerUserId,
        });
      });
      setMySlotsByDate(myGrouped);
      setSelectedDates(Object.keys(myGrouped));

      // Lịch của NGƯỜI KHÁC
      const rAll = await api.get(`/Schedule`).catch(() => ({ data: [] }));
      const rawAll = Array.isArray(rAll.data) ? rAll.data : rAll.data?.data || [];
      const normAll = rawAll.map(normalizeSchedule).filter(Boolean);

      // Fallback: nếu API thiếu carId trong Schedule, xác định cùng xe bằng ownerCarUserId thuộc tập đồng sở hữu của xe đang chọn
      // Bước 1: lấy danh sách người dùng để phục vụ cả việc hiển thị tên và dựng tập carUserId của đồng sở hữu
      let allUsers = [];
      try {
        const rUsers = await api.get("/User");
        allUsers = Array.isArray(rUsers.data) ? rUsers.data : rUsers.data?.data || [];
      } catch {}

      // Bước 2: dựng tập carUserId của đồng sở hữu đối với xe đang chọn
      const ownerCarUserIdSet = new Set();
      try {
        const chunkSize = 8;
        for (let i = 0; i < allUsers.length; i += chunkSize) {
          const batch = allUsers.slice(i, i + chunkSize);
          const rs = await Promise.allSettled(
            batch.map(async (u) => {
              const uid = Number(u.userId ?? u.id);
              if (!Number.isFinite(uid)) return null;
              const r = await api.get(`/users/${uid}/cars`).catch(() => ({ data: [] }));
              const list = Array.isArray(r.data) ? r.data : r.data?.data || [];
              const match = list.find((c) => Number(c.carId ?? c.id) === Number(carId));
              if (!match) return null;
              return Number(match.carUserId ?? match.CarUserId ?? match?.carUser?.carUserId);
            })
          );
          rs.forEach((x) => {
            if (x.status === "fulfilled" && Number.isFinite(x.value)) ownerCarUserIdSet.add(Number(x.value));
          });
        }
      } catch {}

      // Bước 3: lọc lịch đồng sở hữu theo: cùng xe (carId trùng, hoặc ownerCarUserId thuộc tập đồng sở hữu) và không phải của tôi
      const others = normAll.filter((s) => {
        const notMine =
          (myCarUserId ? Number(s.ownerCarUserId) !== Number(myCarUserId) : true) &&
          (s.ownerUserId ? Number(s.ownerUserId) !== Number(userId) : true);
        const hasCar = s.carId != null && Number.isFinite(Number(s.carId));
        const sameCarById = hasCar && Number(s.carId) === Number(carId);
        const sameCarByOwner = ownerCarUserIdSet.size > 0 && ownerCarUserIdSet.has(Number(s.ownerCarUserId));
        return notMine && (sameCarById || (!hasCar && sameCarByOwner));
      });

      // Bước 4: điền tên nếu thiếu
      let resolved = others;
      try {
        const map = new Map(userNameCache);
        allUsers.forEach((u) => {
          const id = Number(u.userId ?? u.id);
          if (Number.isFinite(id)) {
            const name = u.fullName ?? u.userName ?? u.email ?? "User";
            map.set(id, name);
          }
        });
        setUserNameCache(map);
        resolved = resolved.map((x) => ({
          ...x,
          ownerName: x.ownerName || map.get(Number(x.ownerUserId)) || x.ownerName,
        }));
      } catch {}

      const othersGrouped = {};
      resolved.forEach((s) => {
        if (!othersGrouped[s.key]) othersGrouped[s.key] = [];
        othersGrouped[s.key].push({
          startTime: s.startTime,
          endTime: s.endTime,
          id: s.id,
          ownerCarUserId: s.ownerCarUserId,
          ownerUserId: s.ownerUserId,
          ownerName: s.ownerName || userNameCache.get(Number(s.ownerUserId)) || s.ownerName,
        });
      });
      setOthersSlotsByDate(othersGrouped);
    } catch (e) {
      console.warn("loadSchedulesForCar error", e);
      setMySlotsByDate({});
      setOthersSlotsByDate({});
      setSelectedDates([]);
    }
  };

  // ================== EVENTS ==================
  const onChangeVehicle = async (e) => {
    const v = Number(e.target.value);
    setFormData((s) => ({ ...s, vehicleId: v }));
    setSelectedDateForTime(null);
    setNewSlots([]);

    const picked = cars.find((x) => Number(x._carId) === v);
    if (picked && Number(picked.status) !== 1) {
      // vẫn cho chọn để xem lịch cũ, nhưng cảnh báo không thể đặt mới
      alert(
        "Xe đang được xử lý dịch vụ nên tạm thời không thể đăng ký lịch mới."
      );
    }

    await loadSchedulesForCar(v);
  };

  const onClickDay = (day) => {
    if (!day || isPastDate(day)) return;
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDateForTime(d);
    setNewSlots([]);
  };

  const addNewSlot = () =>
    setNewSlots((p) => [...p, { startTime: "", endTime: "" }]);
  const updateNewSlot = (i, field, val) =>
    setNewSlots((p) =>
      p.map((s, idx) => (idx === i ? { ...s, [field]: val } : s))
    );
  const removeNewSlot = (i) =>
    setNewSlots((p) => p.filter((_, idx) => idx !== i));

  const deleteMySlot = async (slot) => {
    try {
      const carId = Number(formData.vehicleId);
      const myCarUserId = carUserMap[carId];

      // Chặn xoá nếu không phải của tôi
      if (Number(slot.ownerCarUserId) !== Number(myCarUserId)) {
        alert("Bạn không có quyền xoá lịch của người khác.");
        return;
      }

      const scheduleId =
        slot?.id ?? slot?.scheduleId ?? slot?.ScheduleId ?? slot?.Id;
      if (!scheduleId) return;

      const res = await api
        .delete(`/Schedule/${Number(scheduleId)}`)
        .catch((e) => {
          console.error("DELETE /Schedule/{id} error:", e);
          throw e;
        });
      if (!(res?.status === 200 || res?.status === 204)) {
        console.warn("DELETE trả mã không mong đợi:", res?.status);
      }

      // Refetch server để đồng bộ
      await loadSchedulesForCar(carId);

      // Cập nhật UI tức thời (an toàn)
      const key = selectedDateForTime ? toLocalDateKey(selectedDateForTime) : "";
      setMySlotsByDate((prev) => {
        const list = (prev[key] || []).filter(
          (x) => (x.id ?? x.scheduleId ?? x.ScheduleId) !== Number(scheduleId)
        );
        return { ...prev, [key]: list };
      });
    } catch (e) {
      console.error(e);
      alert("Xoá lịch thất bại. Vui lòng thử lại.");
    }
  };

  // ================== DERIVED ==================
  // NOTE: phải đặt trước if (loading) để không vi phạm rules of hooks
  const selectedCar = useMemo(
    () => cars.find((x) => String(x._carId) === String(formData.vehicleId)) || null,
    [cars, formData.vehicleId]
  );
  const isSelectedCarActive = selectedCar ? Number(selectedCar.status) === 1 : true;

  // ================== UI ==================
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Đang tải…
      </div>
    );

  const selectedKey = selectedDateForTime
    ? toLocalDateKey(selectedDateForTime)
    : "";
  const myToday = mySlotsByDate[selectedKey] || [];
  const myUsed = myToday.reduce((t, s) => t + duration(s.startTime, s.endTime), 0);
  const remain = Math.max(0, maxDaily() - myUsed);
  const othersToday = othersSlotsByDate[selectedKey] || [];

  return (
    <div className="min-h-screen bg-[#F5F7FB]">
      <Header />
      {/* HERO */}
      <section className="relative pt-24 pb-32 bg-gradient-to-br from-indigo-800 via-blue-700 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1605559424843-9ef0eaf9a097?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-indigo-800/40 to-blue-700/50 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col items-center text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white drop-shadow-lg leading-tight">
            Quản Lý & Đặt Lịch Sử Dụng Xe
          </h1>
        </div>
        <div className="absolute top-1/3 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-10 right-0 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000"></div>
      </section>

      {/* CONTENT */}
      <div className="relative -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CALENDAR */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() =>
                    setCurrentDate(
                      (p) => new Date(p.getFullYear(), p.getMonth() - 1, 1)
                    )
                  }
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Hôm nay
                  </button>
                </div>
                <button
                  onClick={() =>
                    setCurrentDate(
                      (p) => new Date(p.getFullYear(), p.getMonth() + 1, 1)
                    )
                  }
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="border rounded-xl p-4">
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {dayNames.map((d) => (
                    <div
                      key={d}
                      className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider py-2"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(currentDate).map((day, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onClickDay(day)}
                      disabled={isPastDate(day)}
                      className={[
                        "relative h-16 rounded-lg border transition-all",
                        day
                          ? isPastDate(day)
                            ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                            : "bg-white hover:bg-indigo-50 hover:border-indigo-200 border-gray-100 cursor-pointer"
                          : "bg-gray-50 border-gray-100",
                        isToday(day) ? "ring-2 ring-green-400 border-green-300" : "",
                        isSelected(day) ? "bg-indigo-50 border-indigo-300" : "",
                      ].join(" ")}
                    >
                      {day && (
                        <span className="absolute top-2 left-2 text-sm font-medium">{day}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="space-y-6">
            {/* PICK CAR */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 13h18M5 16h14M6 10l1-2h10l1 2" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">Chọn xe</h2>
              </div>

              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={onChangeVehicle}
                className="w-full px-4 py-3 text-base border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="">Chọn xe muốn sử dụng</option>
                {cars.map((v) => (
                  <option key={v._carId} value={v._carId}>
                    {v.carName} - {v.plateNumber}
                    {Number(v.status) !== 1 ? " " : ""}
                  </option>
                ))}
              </select>

              {formData.vehicleId &&
                (() => {
                  const v = cars.find((x) => String(x._carId) === String(formData.vehicleId));
                  if (!v) return null;
                  return (
                    <div className="mt-4 rounded-lg bg-indigo-50 p-4">
                      <div className="text-sm text-gray-600">Xe đã chọn</div>
                      <div className="font-semibold">{v.carName}</div>
                      <div className="text-sm text-gray-600">
                        {v.brand} • {v.plateNumber} • {v.color}
                      </div>
                      <div className="mt-1 text-sm">
                        Trạng thái:{" "}
                        {Number(v.status) === 1 ? (
                          <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">Hoạt động</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-red-100 text-red-700">Không hoạt động</span>
                        )}
                      </div>
                      {v.image && (
                        <img className="w-full h-36 object-cover rounded-lg mt-2" src={v.image} alt={v.carName} />
                      )}
                    </div>
                  );
                })()}
            </div>

            {/* DAY DETAILS */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-900">
                  {selectedDateForTime ? `Ngày ${selectedKey}` : "Đặt lịch"}
                </h2>
              </div>

              {/* Banner khi xe không hoạt động */}
              {selectedCar && !isSelectedCarActive && (
                <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800 text-sm">
                  Xe đang được xử lý dịch vụ nên tạm thời <b>không thể đăng ký lịch mới</b>.
                </div>
              )}

              {!selectedDateForTime ? (
                <p className="text-sm text-gray-500">Chọn 1 ngày trên lịch để xem & tạo khung giờ.</p>
              ) : (
                <>
                  {/* MY SLOTS */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
                      <p className="text-sm font-semibold text-gray-900">Lịch của tôi</p>
                    </div>
                    {myToday.length === 0 ? (
                      <div className="text-sm text-gray-500">Chưa có lịch trong ngày này.</div>
                    ) : (
                      <ul className="space-y-2">
                        {myToday
                          .slice()
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map((s, i) => (
                            <li
                              key={s.id || i}
                              className="flex items-center justify-between px-3 py-2 rounded-md bg-green-50 border border-green-200"
                            >
                              <span className="text-sm text-green-800 font-medium">
                                {s.startTime} – {s.endTime}
                              </span>
                              <button
                                onClick={() => deleteMySlot(s)}
                                className="text-red-600 hover:text-red-700 text-xs font-medium"
                                title="Xoá slot của tôi"
                              >
                                Xoá
                              </button>
                            </li>
                          ))}
                      </ul>
                    )}
                    <div className="mt-2 text-xs text-gray-600">
                      Đã dùng: <b>{myUsed.toFixed(2)}h</b> • Còn lại hôm nay: <b>{remain.toFixed(2)}h</b>
                    </div>
                    <hr className="my-4" />
                  </div>

                  {/* OTHERS' SLOTS (READ-ONLY) */}
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <p className="text-sm font-semibold text-gray-900">Lịch đồng sở hữu</p>
                    </div>
                    {othersToday.length === 0 ? (
                      <div className="text-sm text-gray-500">Không có lịch trùng trong ngày này.</div>
                    ) : (
                      <ul className="space-y-2">
                        {othersToday
                          .slice()
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map((s, i) => (
                            <li
                              key={s.id || i}
                              className="px-3 py-2 rounded-md bg-red-50 border border-red-200 text-sm text-red-700"
                            >
                              {s.startTime} – {s.endTime}
                              {s.ownerName ? (
                                <span className="ml-2 text-red-600/70">({s.ownerName})</span>
                              ) : null}
                            </li>
                          ))}
                      </ul>
                    )}
                    <hr className="my-4" />
                  </div>

                  {/* ADD NEW SLOTS */}
                  <div className="space-y-4">
                    {newSlots.map((slot, idx) => {
                      const d = duration(slot.startTime, slot.endTime);
                      const valid = d >= 1 && d <= maxDaily();
                      return (
                        <div
                          key={idx}
                          className={`p-4 border rounded-lg ${
                            valid ? "border-gray-200" : "border-red-300 bg-red-50"
                          }`}
                        >
                          <div className="grid grid-cols-1  gap-4 ">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1 ">
                                Giờ bắt đầu *
                              </label>
                              <input
                                type="time"
                                value={slot.startTime}
                                onChange={(e) => updateNewSlot(idx, "startTime", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giờ kết thúc *
                              </label>
                              <input
                                type="time"
                                value={slot.endTime}
                                onChange={(e) => updateNewSlot(idx, "endTime", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thời lượng
                              </label>
                              <div
                                className={`px-3 py-2 rounded-lg text-sm font-medium ${
                                  valid ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                                }`}
                              >
                                {d > 0 ? `${d.toFixed(2)}h` : "Chưa chọn"}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex justify-end">
                            <button onClick={() => removeNewSlot(idx)} className="text-red-600 hover:text-red-700 text-sm">
                              Xoá khung giờ
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {/* KHÓA thêm mới khi xe không hoạt động */}
                    <button
                      onClick={addNewSlot}
                      disabled={!isSelectedCarActive}
                      className={`w-full py-3 border-2 border-dashed rounded-lg transition ${
                        !isSelectedCarActive
                          ? "border-gray-300 text-gray-400 cursor-not-allowed"
                          : "border-indigo-300 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50"
                      }`}
                    >
                      + Thêm khung giờ
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      <p>
                        Tổng thời gian thêm mới:{" "}
                        <span className="font-semibold text-indigo-600">
                          {newSlots.reduce((t, s) => t + duration(s.startTime, s.endTime), 0).toFixed(2)}h
                        </span>
                      </p>
                      <p>
                        Còn lại hôm nay: <span className="font-semibold text-gray-700">{remain.toFixed(2)}h</span>
                      </p>
                    </div>
                    {/* KHÓA đặt lịch khi xe không hoạt động */}
                    <button
                      onClick={async () => {
                        if (!isSelectedCarActive) {
                          alert("Xe đang được xử lý dịch vụ nên tạm thời không thể đăng ký lịch mới. Lịch cũ vẫn giữ.");
                          return;
                        }
                        await confirmNewSlots();
                      }}
                      disabled={newSlots.length === 0 || !isSelectedCarActive}
                      className={`px-5 py-3 rounded-lg transition ${
                        newSlots.length === 0 || !isSelectedCarActive
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      Đặt lịch
                    </button>
                  </div>
                </>
              )}
            </div>

            {errorMsg && (
              <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 border border-red-200">
                {errorMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistercarPage;

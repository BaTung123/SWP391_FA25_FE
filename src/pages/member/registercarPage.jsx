import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header/header";
import api from "../../config/axios";

const RegistercarPage = () => {
  const [formData, setFormData] = useState({
    vehicleId: "", // carId
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    purpose: "",
    destination: "",
    estimatedDistance: "",
    notes: "",
  });

  const [user, setUser] = useState(null);
  const [cars, setCars] = useState([]);               // danh sách xe user sở hữu (kèm _carId, _carUserId)
  const [carUserMap, setCarUserMap] = useState({});   // { [carId]: carUserId }
  const [ownershipMap, setOwnershipMap] = useState({}); // { [carId]: percentage }

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Calendar / modal states (UI giữ nguyên)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedDateForTime, setSelectedDateForTime] = useState(null);

  // timeSlots đang chỉnh trong modal hiện tại
  const [timeSlots, setTimeSlots] = useState([]); // [{startTime, endTime, id?}]
  // Lưu các slot đã đăng ký theo ngày: { 'YYYY-MM-DD': [{startTime, endTime, id}] }
  const [registeredTimeSlots, setRegisteredTimeSlots] = useState({});

  // Lấy user hiện tại
  const getCurrentUser = async () => {
    try {
      const fromStorage = localStorage.getItem("user");
      if (fromStorage) return JSON.parse(fromStorage);
    } catch {
      /* ignore */
    }
    const me = await api.get("/Auth/me").catch(() => null);
    return me?.data?.data || me?.data || null;
  };

  // ======= Load xe mà user sở hữu + phần trăm sở hữu =======
  useEffect(() => {
    const boot = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const me = await getCurrentUser();
        if (!me) throw new Error("Bạn chưa đăng nhập.");
        const userId = me.userId ?? me.id ?? me.Id;
        if (!userId) throw new Error("Thiếu userId để tra cứu xe.");
        setUser(me);

        // 1) Lấy danh sách xe mà user đang sở hữu
        const res = await api.get(`/users/${userId}/cars`);
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

        const mapped = list
          .filter(Boolean)
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

            return {
              ...it,
              _carId: carId,
              _carUserId: carUserId,
              carName: it.carName ?? it.name ?? it.CarName,
              brand: it.brand ?? it.Brand,
              plateNumber: it.plateNumber ?? it.PlateNumber,
              color: it.color ?? it.Color,
              image: it.image ?? it.Image,
            };
          })
          .filter((x) => x._carId != null);

        setCars(mapped);

        const mapCU = {};
        for (const c of mapped) if (c._carUserId != null) mapCU[c._carId] = c._carUserId;
        setCarUserMap(mapCU);

        // 2) Lấy phần trăm sở hữu theo carUserId từ /PercentOwnership
        const ownMap = {};
        try {
          const poRes = await api.get("/PercentOwnership");
          const listPO = Array.isArray(poRes.data) ? poRes.data : poRes.data?.data || [];

          for (const c of mapped) {
            const po = listPO.find(
              (p) => Number(p.carUserId ?? p.CarUserId) === Number(c._carUserId)
            );
            if (po && po.percentage != null) {
              ownMap[c._carId] = Number(po.percentage);
            } else {
              // nếu chưa có dữ liệu phần trăm → mặc định full quyền 100%
              ownMap[c._carId] = 100;
            }
          }
        } catch {
          // fallback: coi như 100% cho tất cả xe
          for (const c of mapped) ownMap[c._carId] = 100;
        }
        setOwnershipMap(ownMap);

        // 🔁 Auto chọn xe đầu tiên + load lịch
        if (mapped.length > 0) {
          const firstId = mapped[0]._carId;
          setFormData((p) => ({ ...p, vehicleId: firstId }));
          await loadSchedulesForCar(firstId, mapCU);
        }
      } catch (err) {
        console.error(err);
        setErrorMsg(err?.message || "Không thể tải danh sách xe.");
      } finally {
        setLoading(false);
      }
    };
    boot();
  }, []);

  // ======= 🧩 Load lịch theo car (hydrate vào calendar) =======
  const loadSchedulesForCar = async (carId, mapCU = null) => {
    try {
      const cuMap = mapCU ?? carUserMap;
      const carUserId = cuMap[carId];
      if (!carUserId) {
        // không có liên kết CarUser → clear lịch
        setRegisteredTimeSlots({});
        setSelectedDates([]);
        return;
      }

      // Ưu tiên query theo carUserId; bạn có thể đổi endpoint theo BE
      const res = await api.get(`/Schedule?carUserId=${carUserId}`);
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];

      const grouped = {};
      for (const item of list) {
        const startIso = item.startDate ?? item.StartDate;
        const endIso = item.endDate ?? item.EndDate;
        if (!startIso || !endIso) continue;

        const start = new Date(startIso);
        const end = new Date(endIso);
        const dateKey = start.toISOString().split("T")[0];

        const startTime = `${String(start.getHours()).padStart(2, "0")}:${String(
          start.getMinutes()
        ).padStart(2, "0")}`;
        const endTime = `${String(end.getHours()).padStart(2, "0")}:${String(
          end.getMinutes()
        ).padStart(2, "0")}`;

        const id =
          item.id ?? item.scheduleId ?? item.Id ?? item.ScheduleId ?? null;

        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push({ startTime, endTime, id });
      }

      setRegisteredTimeSlots(grouped);
      setSelectedDates(Object.keys(grouped));
    } catch (err) {
      console.warn("Không thể tải lịch:", err);
      // lỗi thì clear để tránh hiển thị sai
      setRegisteredTimeSlots({});
      setSelectedDates([]);
    }
  };

  // ======= UI helpers (giữ nguyên) =======
  const monthNames = useMemo(
    () => [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
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
    const startingDayOfWeek = firstDay.getDay();
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  const goToPreviousMonth = () =>
    setCurrentDate((p) => new Date(p.getFullYear(), p.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setCurrentDate((p) => new Date(p.getFullYear(), p.getMonth() + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };
  const isPastDate = (day) => {
    if (!day) return false;
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  };
  const isSelected = (day) => {
    if (!day) return false;
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return selectedDates.includes(d.toISOString().split("T")[0]);
  };

  const roundToNearest15 = (t) => {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    const tot = h * 60 + m;
    const r = Math.round(tot / 15) * 15;
    const H = String(Math.floor(r / 60)).padStart(2, "0");
    const M = String(r % 60).padStart(2, "0");
    return `${H}:${M}`;
  };
  const calcDuration = (s, e) => {
    if (!s || !e) return 0;
    const [sh, sm] = s.split(":").map(Number);
    const [eh, em] = e.split(":").map(Number);
    return (eh * 60 + em - (sh * 60 + sm)) / 60;
  };

  // ======= QUY TẮC GIỚI HẠN GIỜ/TỶ LỆ SỞ HỮU =======
  // Xe có 100% quyền sử dụng. User được (percentage/100) * 24h/ngày.
  const maxDaily = () => {
    const carId = Number(formData.vehicleId);
    const percent = ownershipMap[carId] ?? 100;      // nếu thiếu dữ liệu → 100%
    return (percent / 100) * 24;
  };

  const totalHours = () =>
    timeSlots.reduce((t, sl) => t + calcDuration(sl.startTime, sl.endTime), 0);

  const updateSlot = (i, field, val) =>
    setTimeSlots((p) =>
      p.map((s, idx) =>
        idx === i ? { ...s, [field]: roundToNearest15(val) } : s
      )
    );
  const addTimeSlot = () => setTimeSlots((p) => [...p, { startTime: "", endTime: "" }]);
  const removeTimeSlot = (i) => setTimeSlots((p) => p.filter((_, idx) => idx !== i));

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    // Khi đổi xe → load lại lịch từ BE
    if (name === "vehicleId" && value) {
      await loadSchedulesForCar(Number(value));
    }
  };

  const handleDateClick = (day) => {
    if (!day || isPastDate(day)) return;
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const key = d.toISOString().split("T")[0];
    setSelectedDateForTime(d);
    setTimeSlots(registeredTimeSlots[key] ?? []);
    setShowTimeModal(true);
  };

  // ======= POST /Schedule cho mỗi slot =======
  const confirmSlots = async () => {
    try {
      if (!formData.vehicleId) return alert("Vui lòng chọn xe trước.");
      if (!selectedDateForTime) return;

      if (timeSlots.length === 0) return alert("Vui lòng thêm ít nhất 1 khung giờ.");
      // Kiểm tra theo % sở hữu (maxDaily())
      for (let i = 0; i < timeSlots.length; i++) {
        const d = calcDuration(timeSlots[i].startTime, timeSlots[i].endTime);
        if (d < 1) return alert(`Khung giờ ${i + 1} tối thiểu 1 giờ`);
        if (d > maxDaily())
          return alert(`Khung giờ ${i + 1} vượt quá giới hạn ${maxDaily()}h/ngày theo % sở hữu`);
      }
      const sum = totalHours();
      if (sum > maxDaily())
        return alert(`Tổng thời gian ${sum.toFixed(2)}h > giới hạn ${maxDaily()}h/ngày theo % sở hữu`);

      const carId = Number(formData.vehicleId);
      const carUserId = carUserMap[carId];
      if (!carUserId) {
        return alert(
          "Không tìm thấy carUserId của xe đã chọn. Kiểm tra response /users/{userId}/cars có trả carUserId không."
        );
      }

      const dateKey = selectedDateForTime.toISOString().split("T")[0];
      const created = [];

      for (const slot of timeSlots) {
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
          carUserId,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          status: 0,
        };

        const res = await api.post("/Schedule", body);
        const saved = res?.data?.data || res?.data || {};
        const scheduleId = saved.id ?? saved.scheduleId ?? saved.Id ?? saved.ScheduleId ?? undefined;

        created.push({
          startTime: slot.startTime,
          endTime: slot.endTime,
          id: scheduleId,
        });
      }

      // Lưu local + đánh dấu ngày
      setRegisteredTimeSlots((prev) => ({ ...prev, [dateKey]: created }));
      setSelectedDates((p) => (p.includes(dateKey) ? p : [...p, dateKey]));

      alert(
        `Đăng ký thành công ngày ${selectedDateForTime.toLocaleDateString(
          "vi-VN"
        )} với ${timeSlots.length} khung giờ (${sum.toFixed(2)}h).`
      );
      setShowTimeModal(false);
      setSelectedDateForTime(null);
      setTimeSlots([]);
    } catch (e) {
      console.error(e);
      alert("Không thể lưu lịch. Vui lòng thử lại.");
    }
  };

  // ======= DELETE /Schedule/{id} để hủy =======
  const cancelRegistration = async () => {
    if (!selectedDateForTime) return;
    const key = selectedDateForTime.toISOString().split("T")[0];
    const slots = registeredTimeSlots[key] || [];

    try {
      for (const s of slots) {
        if (s?.id != null) {
          await api.delete(`/Schedule/${s.id}`);
        }
      }
    } catch (e) {
      console.error(e);
      // vẫn clear local để UI phản hồi
    }

    setRegisteredTimeSlots((p) => {
      const n = { ...p };
      delete n[key];
      return n;
    });
    setSelectedDates((p) => p.filter((d) => d !== key));
    alert(`Đã hủy đăng ký ngày ${selectedDateForTime.toLocaleDateString("vi-VN")}`);
    setShowTimeModal(false);
    setSelectedDateForTime(null);
    setTimeSlots([]);
  };

  // ======= Render (UI giữ nguyên) =======
  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải…</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">Đăng ký lịch sử dụng xe</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* chọn xe */}
          <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-1">
            <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Thông tin đăng ký</h2>
            <div className="mb-8">
              <select
                name="vehicleId"
                value={formData.vehicleId}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 text-lg border-2 border-indigo-100 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="">-- Chọn xe --</option>
                {cars.map((v) => (
                  <option key={v._carId} value={v._carId}>
                    {v.carName} - {v.plateNumber}
                  </option>
                ))}
              </select>
            </div>

            {formData.vehicleId && (
              <div className="space-y-2 bg-indigo-50 rounded-lg p-4">
                {(() => {
                  const v = cars.find((x) => String(x._carId) === String(formData.vehicleId));
                  if (!v) return null;
                  return (
                    <>
                      <div className="text-sm text-gray-600">Xe đã chọn</div>
                      <div className="font-semibold">{v.carName}</div>
                      <div className="text-sm text-gray-600">
                        {v.brand} • {v.plateNumber} • {v.color}
                      </div>
                      {v.image && (
                        <img className="w-full h-40 object-cover rounded-lg mt-2" src={v.image} alt={v.carName} />
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* calendar */}
          <div className="bg-white rounded-xl shadow-lg p-8 xl:col-span-2">
            <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Chọn ngày sử dụng</h2>

            <div className="flex items-center justify-between mb-6">
              <button onClick={goToPreviousMonth} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Tháng trước">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-indigo-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button onClick={goToToday} className="text-base text-indigo-600 hover:text-indigo-800 font-medium">Hôm nay</button>
              </div>

              <button onClick={goToNextMonth} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Tháng sau">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {dayNames.map((d) => (
                  <div key={d} className="p-3 text-center text-base font-semibold text-gray-500 uppercase tracking-wider">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {getDaysInMonth(currentDate).map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleDateClick(day)}
                    disabled={isPastDate(day)}
                    className={`relative p-4 min-h-[60px] border-2 transition-all duration-200
                      ${day ? (isPastDate(day) ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed"
                        : "hover:bg-indigo-50 hover:border-indigo-200 border-gray-100 cursor-pointer")
                        : "bg-gray-50 border-gray-100"}
                      ${isToday(day) ? "bg-green-100 border-green-300 text-green-900 font-bold" : ""}
                      ${isSelected(day) ? "bg-green-200 border-green-400 text-green-900 font-semibold" : ""}`}
                  >
                    {day && <span className="text-base">{day}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* modal chọn khung giờ */}
        {showTimeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-indigo-900">
                  {registeredTimeSlots[selectedDateForTime?.toISOString().split("T")[0]]
                    ? `Khung giờ đã đăng ký - ${selectedDateForTime?.toLocaleDateString("vi-VN")}`
                    : `Chọn khung giờ cho ngày ${selectedDateForTime?.toLocaleDateString("vi-VN")}`}
                </h3>
                <button onClick={() => { setShowTimeModal(false); setSelectedDateForTime(null); setTimeSlots([]); }} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
              </div>

              <div className="space-y-4">
                {timeSlots.map((slot, index) => {
                  const dur = calcDuration(slot.startTime, slot.endTime);
                  const valid = dur >= 1 && dur <= maxDaily();
                  const viewing = !!registeredTimeSlots[selectedDateForTime?.toISOString().split("T")[0]];

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-4 p-4 border rounded-lg ${
                        valid ? "border-gray-200" : "border-red-300 bg-red-50"
                      } ${viewing ? "bg-green-50 border-green-200" : ""}`}
                    >
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giờ bắt đầu</label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) => updateSlot(index, "startTime", e.target.value)}
                          disabled={viewing}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
                            viewing ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Giờ kết thúc</label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) => updateSlot(index, "endTime", e.target.value)}
                          disabled={viewing}
                          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none ${
                            viewing ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời lượng</label>
                        <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          viewing ? "text-green-600 bg-green-100" : valid ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
                        }`}>
                          {dur > 0 ? `${dur.toFixed(2)}h` : "Chưa chọn"}
                        </div>
                      </div>
                      {!viewing && (
                        <button
                          onClick={() => removeTimeSlot(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                          title="Xóa khung giờ"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  );
                })}

                {!registeredTimeSlots[selectedDateForTime?.toISOString().split("T")[0]] && (
                  <button
                    onClick={addTimeSlot}
                    className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition"
                  >
                    + Thêm khung giờ
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-gray-600">
                  <p>Tổng thời gian: <span className="font-semibold text-indigo-600">{totalHours().toFixed(2)}h</span></p>
                  {!registeredTimeSlots[selectedDateForTime?.toISOString().split("T")[0]] && (
                    <p>Giới hạn: <span className="font-semibold text-gray-700">{maxDaily()}h</span></p>
                  )}
                </div>
                <div className="flex space-x-4">
                  {registeredTimeSlots[selectedDateForTime?.toISOString().split("T")[0]] && (
                    <button
                      onClick={async () => { await cancelRegistration(); }}
                      className="px-6 py-3 rounded-lg transition bg-red-600 text-white hover:bg-red-700"
                    >
                      Hủy đăng ký
                    </button>
                  )}

                  {!registeredTimeSlots[selectedDateForTime?.toISOString().split("T")[0]] && (
                    <button
                      onClick={async () => { await confirmSlots(); }}
                      disabled={totalHours() === 0 || totalHours() > maxDaily()}
                      className={`px-6 py-3 rounded-lg transition ${
                        totalHours() === 0 || totalHours() > maxDaily()
                          ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                    >
                      Đăng ký
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistercarPage;

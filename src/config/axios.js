import axios from 'axios';
const api = axios.create({
  // baseURL: 'http://40.82.145.164:8080/api'
  baseURL: '/api'
  
});
export default api;

  // const confirmNewSlots = async () => {
  //   try {
  //     if (!formData.vehicleId) return alert("Vui lòng chọn xe trước.");
  //     if (!selectedDateForTime) return;
  //     if (newSlots.length === 0) return alert("Vui lòng thêm khung giờ.");

  //     // min/max cho từng slot
  //     for (let i = 0; i < newSlots.length; i++) {
  //       const d = duration(newSlots[i].startTime, newSlots[i].endTime);
  //       if (d <= 0) return alert(`Khung giờ ${i + 1} chưa hợp lệ`);
  //       if (d < 1) return alert(`Khung giờ ${i + 1} tối thiểu 1 giờ`);
  //       if (d > maxDaily())
  //         return alert(`Khung giờ ${i + 1} vượt quá ${maxDaily()}h/ngày`);
  //     }

  //     const k = toLocalDateKey(selectedDateForTime);
  //     const myToday = mySlotsByDate[k] || [];
  //     const myUsed = myToday.reduce(
  //       (t, s) => t + duration(s.startTime, s.endTime),
  //       0
  //     );
  //     const remain = Math.max(0, maxDaily() - myUsed);
  //     const newSum = newSlots.reduce(
  //       (t, s) => t + duration(s.startTime, s.endTime),
  //       0
  //     );
  //     if (newSum > remain)
  //       return alert(
  //         `Bạn còn ${remain.toFixed(2)}h trong ngày (đã dùng ${myUsed.toFixed(
  //           2
  //         )}h).`
  //       );

  //     // tránh trùng với tôi
  //     for (const ns of newSlots) {
  //       for (const ms of myToday) {
  //         if (overlap(ns, ms)) {
  //           return alert(
  //             `Trùng lịch của bạn: ${ns.startTime}–${ns.endTime} vs ${ms.startTime}–${ms.endTime}`
  //           );
  //         }
  //       }
  //     }
  //     // tránh trùng với đồng sở hữu
  //     const othersToday = othersSlotsByDate[k] || [];
  //     for (const ns of newSlots) {
  //       for (const os of othersToday) {
  //         if (overlap(ns, os)) {
  //           return alert(
  //             `Trùng lịch đồng sở hữu: ${ns.startTime}–${ns.endTime} vs ${os.startTime}–${os.endTime}`
  //           );
  //         }
  //       }
  //     }

  //     const carId = Number(formData.vehicleId);
  //     const myCarUserId = carUserMap[carId];
  //     if (!myCarUserId)
  //       return alert("Không tìm thấy carUserId của bạn trên xe này.");

  //     const created = [];
  //     for (const slot of newSlots) {
  //       const [sh, sm] = slot.startTime.split(":").map(Number);
  //       const [eh, em] = slot.endTime.split(":").map(Number);
  //       const start = new Date(
  //         selectedDateForTime.getFullYear(),
  //         selectedDateForTime.getMonth(),
  //         selectedDateForTime.getDate(),
  //         sh,
  //         sm,
  //         0,
  //         0
  //       );
  //       const end = new Date(
  //         selectedDateForTime.getFullYear(),
  //         selectedDateForTime.getMonth(),
  //         selectedDateForTime.getDate(),
  //         eh,
  //         em,
  //         0,
  //         0
  //       );

  //       const body = {
  //         carUserId: myCarUserId,
  //         startDate: toLocalIso(start),
  //         endDate: toLocalIso(end),
  //         status: 0,
  //       };
  //       const res = await api.post("/Schedule", body);
  //       const saved = res?.data?.data || res?.data || {};
  //       created.push({
  //         startTime: slot.startTime,
  //         endTime: slot.endTime,
  //         id:
  //           saved.id ??
  //           saved.scheduleId ??
  //           saved.Id ??
  //           saved.ScheduleId ??
  //           null,
  //         ownerCarUserId: myCarUserId,
  //         ownerUserId: me?._id,
  //       });
  //     }

  //     setMySlotsByDate((prev) => ({
  //       ...prev,
  //       [k]: [...(prev[k] || []), ...created],
  //     }));
  //     setSelectedDates((p) => (p.includes(k) ? p : [...p, k]));
  //     setNewSlots([]);

  //     await loadSchedulesForCar(carId);
  //     alert("Đặt lịch thành công.");
  //   } catch (e) {
  //     console.error(e);
  //     alert("Không thể lưu lịch. Vui lòng thử lại.");
  //   }
  // };
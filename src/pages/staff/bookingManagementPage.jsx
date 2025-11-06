import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, Select, Modal, Spin, Empty, message, Tag } from "antd";
import { FaUsers, FaCar, FaCheckCircle, FaClock } from "react-icons/fa";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../../config/axios";

const { Option } = Select;

/* ---------------- helpers ---------------- */
const S = (v) => (v === null || v === undefined ? "" : String(v));

const toISODateTime = (item) => {
  if (item.startDate || item.endDate) {
    const s = item.startDate ? new Date(item.startDate) : new Date();
    const e = item.endDate ? new Date(item.endDate) : new Date(s.getTime() + 60 * 60 * 1000);
    return { start: s.toISOString(), end: e.toISOString() };
  }
  if (item.start && item.end) return { start: item.start, end: item.end };

  if (item.startDate && item.startTime) {
    const s = new Date(`${item.startDate}T${item.startTime}`);
    const e =
      item.endDate && item.endTime
        ? new Date(`${item.endDate}T${item.endTime}`)
        : new Date(s.getTime() + 60 * 60 * 1000);
    return { start: s.toISOString(), end: e.toISOString() };
  }
  if (item.date && item.time) {
    const [t1, t2] = String(item.time).split("-").map((s) => s.trim());
    const start = new Date(`${item.date}T${t1 || "08:00"}`);
    const end = new Date(`${item.date}T${t2 || "09:00"}`);
    return { start: start.toISOString(), end: end.toISOString() };
  }
  if (item.date) {
    const start = new Date(`${item.date}T08:00`);
    const end = new Date(`${item.date}T09:00`);
    return { start: start.toISOString(), end: end.toISOString() };
  }
  const s = new Date();
  const e = new Date(s.getTime() + 60 * 60 * 1000);
  return { start: s.toISOString(), end: e.toISOString() };
};

const statusOf = (sch) => {
  const { end } = toISODateTime(sch);
  return new Date(end) < new Date() ? "Hoàn tất" : "Chờ duyệt";
};

/* ---------------- component ---------------- */
const GroupVehicleBookingDashboard = () => {
  const [loading, setLoading] = useState(false);

  // Xe, lịch, user
  const [cars, setCars] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Đồng sở hữu theo carId: Map<carIdStr, Owner[]>, mỗi owner có _carUserId
  const [ownersByCarId, setOwnersByCarId] = useState(new Map());

  // Xe đang chọn
  const [selectedCarId, setSelectedCarId] = useState("");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState(null);
  const [modalItems, setModalItems] = useState([]);

  // cache user theo id
  const userCache = useRef(new Map());

  /* -------- load cars + schedules + users (1 lần) -------- */
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const [carRes, schRes, userRes] = await Promise.all([
          api.get("/Car"),
          api.get("/Schedule"),
          api.get("/User"),
        ]);

        // Cars
        const carsData = Array.isArray(carRes?.data) ? carRes.data : [];
        const normCars = carsData.map((c) => ({
          ...c,
          __id: S(c.id ?? c.carId),
          __name: c.name ?? c.brand ?? c.carName ?? c.model ?? `Xe #${c.id ?? c.carId}`,
          __plate: c.licensePlate ?? c.license ?? c.plateNumber ?? "",
        }));
        setCars(normCars);
        if (normCars.length) setSelectedCarId(normCars[0].__id);

        // Schedules (API trả carUserId)
        const schData = Array.isArray(schRes?.data) ? schRes.data : [];
        const normSchedules = schData.map((s) => ({
          ...s,
          __carUserId: S(s.carUserId ?? s.CarUserId),
        }));
        setSchedules(normSchedules);

        // Users
        const usersData = Array.isArray(userRes?.data) ? userRes.data : [];
        setAllUsers(usersData);
        usersData.forEach((u) => userCache.current.set(S(u.id ?? u.userId), u));
      } catch (e) {
        console.error(e);
        message.error("Không tải được dữ liệu hệ thống (Car/Schedule/User).");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  /* -------- khi đổi xe: dựng danh sách đồng sở hữu từ GET /users/{uid}/cars -------- */
  useEffect(() => {
    const loadOwnersForCar = async (carId) => {
      if (!carId) return;
      if (ownersByCarId.has(carId)) return; // cache

      try {
        // duyệt users theo lô để tránh quá nhiều request song song
        const owners = [];
        const chunkSize = 8;
        for (let i = 0; i < allUsers.length; i += chunkSize) {
          const batch = allUsers.slice(i, i + chunkSize);
          const results = await Promise.allSettled(
            batch.map(async (u) => {
              const uid = S(u.id ?? u.userId);
              // Route CHUẨN có trong Swagger
              const r = await api.get(`/users/${uid}/cars`);
              const list = Array.isArray(r?.data) ? r.data : [];
              // tìm đúng chiếc xe đang chọn để lấy carUserId
              const match = list.find((c) => S(c.id ?? c.carId) === carId);
              if (match) {
                return {
                  ...u,
                  _userId: uid,
                  _carUserId: S(match.carUserId ?? match.CarUserId), // rất quan trọng để map schedule
                };
              }
              return null;
            })
          );
          results.forEach((rs) => {
            if (rs.status === "fulfilled" && rs.value) owners.push(rs.value);
          });
        }

        setOwnersByCarId((prev) => {
          const cp = new Map(prev);
          cp.set(carId, owners);
          return cp;
        });
      } catch (e) {
        console.error(e);
        message.warning("Không lấy được danh sách đồng sở hữu.");
        setOwnersByCarId((prev) => {
          const cp = new Map(prev);
          cp.set(carId, []);
          return cp;
        });
      }
    };

    if (selectedCarId && allUsers.length) void loadOwnersForCar(selectedCarId);
  }, [selectedCarId, allUsers, ownersByCarId]);

  /* -------- maps & selectors -------- */
  const carsById = useMemo(() => {
    const m = new Map();
    for (const c of cars) m.set(c.__id, c);
    return m;
  }, [cars]);

  const owners = ownersByCarId.get(selectedCarId) || [];
  const ownerIdSet = useMemo(
    () => new Set(owners.map((u) => S(u.id ?? u.userId))),
    [owners]
  );
  const carUserIdSet = useMemo(
    () => new Set(owners.map((u) => S(u._carUserId))),
    [owners]
  );

  // Lọc lịch THEO carUserId
  const filteredSchedules = useMemo(() => {
    if (!selectedCarId || carUserIdSet.size === 0) return [];
    return schedules.filter((s) => carUserIdSet.has(s.__carUserId));
  }, [schedules, selectedCarId, carUserIdSet]);

  // Thống kê
  const totalBookings = filteredSchedules.length;
  const doneCount = filteredSchedules.filter((s) => statusOf(s) === "Hoàn tất").length;
  const pendingCount = totalBookings - doneCount;
  const memberCount = owners.length;
  // const ownersBookedCount = useMemo(() => {
  //   const bookedCU = new Set(filteredSchedules.map((s) => s.__carUserId));
  //   let cnt = 0;
  //   owners.forEach((o) => {
  //     if (bookedCU.has(S(o._carUserId))) cnt += 1;
  //   });
  //   return cnt;
  // }, [filteredSchedules, owners]);

  // Events
  const calendarEvents = useMemo(() => {
    const v = carsById.get(selectedCarId);
    const license = v?.__plate || "";
    return filteredSchedules.map((s) => {
      const { start, end } = toISODateTime(s);
      const status = statusOf(s);
      return {
        id: s.scheduleId ?? s.id ?? `${start}-${end}`,
        title: `${license || "Xe"} - ${status}`,
        start,
        end,
        color: status === "Hoàn tất" ? "green" : "orange",
        extendedProps: { ...s, status, license },
      };
    });
  }, [filteredSchedules, selectedCarId, carsById]);

  // modal detail theo ngày
  const onDateClick = async (arg) => {
    if (!selectedCarId) return;
    const day = new Date(arg.dateStr);
    const next = new Date(day.getTime() + 24 * 60 * 60 * 1000);

    const items = filteredSchedules.filter((s) => {
      const { start, end } = toISODateTime(s);
      const st = new Date(start);
      const en = new Date(end);
      return st < next && en >= day;
    });

    // map carUserId → owner
    const enriched = items.map((it) => {
      const owner = owners.find((o) => S(o._carUserId) === S(it.__carUserId));
      const { start, end } = toISODateTime(it);
      return { ...it, _owner: owner || null, _start: start, _end: end, _status: statusOf(it) };
    });

    setModalDate(arg.dateStr);
    setModalItems(enriched);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển đặt lịch xe đồng sở hữu</h1>

      {loading ? (
        <div className="py-16 flex justify-center"><Spin size="large" /></div>
      ) : cars.length === 0 ? (
        <Empty description="Chưa có xe nào trong hệ thống" />
      ) : (
        <>
          {/* --- THỐNG KÊ --- */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border flex items-center">
              <div className="p-3 rounded-full bg-blue-100"><FaUsers className="w-6 h-6 text-blue-600" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng thành viên</p>
                <p className="text-2xl font-bold text-gray-900">{memberCount}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border flex items-center">
              <div className="p-3 rounded-full bg-green-100"><FaCar className="w-6 h-6 text-green-600" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tổng lượt đặt xe</p>
                <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border flex items-center">
              <div className="p-3 rounded-full bg-purple-100"><FaCheckCircle className="w-6 h-6 text-purple-600" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hoàn tất</p>
                <p className="text-2xl font-bold text-gray-900">{doneCount}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border flex items-center">
              <div className="p-3 rounded-full bg-yellow-100"><FaClock className="w-6 h-6 text-yellow-600" /></div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
                <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
              </div>
            </div>
          </div>

          {/* --- LỊCH --- */}
          <Card
            title="Lịch đặt xe hệ thống"
            extra={
              <Select value={selectedCarId} onChange={setSelectedCarId} style={{ width: 360 }}>
                {cars.map((c) => (
                  <Option key={c.__id} value={c.__id}>
                    {c.__name} {c.__plate ? `(${c.__plate})` : ""}
                  </Option>
                ))}
              </Select>
            }
          >
            {!selectedCarId ? (
              <div className="py-10"><Empty description="Hãy chọn xe để xem lịch" /></div>
            ) : (
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                height="70vh"
                dateClick={onDateClick}
                eventDisplay="block"
                eventContent={(eventInfo) => {
                  const ep = eventInfo.event.extendedProps;
                  return (
                    <div style={{ fontSize: 11, padding: "2px 4px" }}>
                      <div style={{ fontWeight: "bold" }}>{ep.license || "Xe"}</div>
                      <div style={{ fontSize: 10, opacity: 0.8 }}>{ep.status}</div>
                    </div>
                  );
                }}
                eventMouseEnter={(info) => {
                  const ep = info.event.extendedProps;
                  info.el.style.cursor = "pointer";
                  info.el.title =
                    `CarUserId: ${ep.__carUserId}\n` +
                    `Từ: ${new Date(info.event.start).toLocaleString("vi-VN")}\n` +
                    `Đến: ${new Date(info.event.end).toLocaleString("vi-VN")}\n` +
                    `Trạng thái: ${ep.status}`;
                }}
              />
            )}
          </Card>

          {/* MODAL TRONG NGÀY */}
          <Modal
            open={modalOpen}
            title={<span>Chi tiết đặt xe ngày {modalDate ? new Date(modalDate).toLocaleDateString("vi-VN") : ""}</span>}
            onCancel={() => setModalOpen(false)}
            footer={null}
            width={820}
          >
            {/* Đồng sở hữu của xe */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Đồng sở hữu</div>
              {owners.length === 0 ? (
                <span className="text-gray-500 text-sm">Chưa xác định đồng sở hữu cho xe này.</span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {owners.map((u) => (
                    <Tag key={S(u.id ?? u.userId)} color="blue">
                      {(u.fullName || u.name || u.userName || `User#${S(u.id ?? u.userId)}`) }
                    </Tag>
                  ))}
                </div>
              )}
            </div>

            {/* Lượt đặt trong ngày */}
            {modalItems.length === 0 ? (
              <Empty description="Không có đặt lịch trong ngày này" />
            ) : (
              <div className="space-y-3">
                {modalItems
                  .sort((a, b) => new Date(a._start) - new Date(b._start))
                  .map((it) => {
                    const owner = it._owner;
                    const name =
                      owner?.fullName || owner?.name || owner?.userName || `CarUser #${it.__carUserId}`;
                    const isOwner = !!owner && ownerIdSet.has(S(owner.id ?? owner.userId));
                    return (
                      <div key={it.scheduleId ?? it.id} className="border rounded-lg p-3 flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {name} {isOwner ? <Tag color="green">Đồng sở hữu</Tag> : <Tag>Khách</Tag>}
                          </div>
                          <div className="text-sm text-gray-600">Bắt đầu: {new Date(it._start).toLocaleString("vi-VN")}</div>
                          <div className="text-sm text-gray-600">Kết thúc: {new Date(it._end).toLocaleString("vi-VN")}</div>
                          {/* {it.__carUserId && (
                            <div className="text-xs text-gray-500 mt-1">CarUserId: {it.__carUserId}</div>
                          )} */}
                        </div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              it._status === "Hoàn tất" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {it._status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default GroupVehicleBookingDashboard;

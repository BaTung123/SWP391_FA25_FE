import React, { useState, useMemo } from "react";
import { FaUsers, FaCar, FaCheckCircle, FaClock } from "react-icons/fa";
import { Card, Select } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const { Option } = Select;

const GroupVehicleBookingDashboard = () => {
  const [groupMembers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@example.com",
      bookings: [
        { id: 1, vehicle: "Toyota Camry 2023", license: "29A-12345", date: "2025-10-15", time: "10:00 - 12:00", status: "Chờ duyệt", bookedBy: "Nguyễn Văn An", bookedAt: "2025-10-10 14:30" },
        { id: 2, vehicle: "BMW X5 2023", license: "29B-67890", date: "2025-10-17", time: "11:00 - 13:00", status: "Hoàn tất", bookedBy: "Nguyễn Văn An", bookedAt: "2025-10-12 09:15" },
      ],
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh.tran@example.com",
      bookings: [
        { id: 3, vehicle: "Toyota Camry 2023", license: "29A-12345", date: "2025-10-16", time: "08:00 - 10:00", status: "Hoàn tất", bookedBy: "Trần Thị Bình", bookedAt: "2025-10-11 10:20" },
        { id: 4, vehicle: "Mazda CX-5 2023", license: "29C-22222", date: "2025-10-18", time: "14:00 - 16:00", status: "Chờ duyệt", bookedBy: "Trần Thị Bình", bookedAt: "2025-10-15 09:00" },
      ],
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      email: "cuong.le@example.com",
      bookings: [
        { id: 5, vehicle: "Toyota Camry 2023", license: "29A-12345", date: "2025-10-20", time: "09:00 - 11:00", status: "Hoàn tất", bookedBy: "Lê Văn Cường", bookedAt: "2025-10-14 16:20" },
      ],
    },
  ]);

  const statusColors = { "Chờ duyệt": "orange", "Hoàn tất": "green" };

  // Danh sách tất cả xe (unique)
  const vehicleList = useMemo(() => {
    const all = groupMembers.flatMap((m) =>
      m.bookings.map((b) => ({ name: b.vehicle, license: b.license }))
    );
    const unique = Array.from(
      new Map(all.map((v) => [v.license, v])).values()
    );
    return unique;
  }, [groupMembers]);

  // State cho xe được chọn
  const [selectedVehicle, setSelectedVehicle] = useState("Tất cả");

  // Sự kiện hiển thị trên lịch (lọc theo xe)
  const calendarEvents = useMemo(() => {
    const events = groupMembers.flatMap((m) =>
      m.bookings
        .filter(
          (b) =>
            selectedVehicle === "Tất cả" ||
            b.vehicle === selectedVehicle
        )
        .map((b) => ({
          title: `${m.name} - ${b.vehicle}`,
          start: b.date,
          color: statusColors[b.status],
          extendedProps: { ...b, member: m.name },
        }))
    );
    return events;
  }, [groupMembers, selectedVehicle]);

  const totalBookings = groupMembers.reduce((sum, m) => sum + m.bookings.length, 0);
  const statusCounts = Object.keys(statusColors).reduce((acc, key) => {
    acc[key] = groupMembers.flatMap((m) => m.bookings).filter((b) => b.status === key).length;
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">
        Bảng điều khiển đặt lịch xe đồng sở hữu
      </h1>

      {/* --- THỐNG KÊ --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tổng thành viên */}
        <div className="bg-white rounded-lg shadow-md p-6 border flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <FaUsers className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Tổng số thành viên</p>
            <p className="text-2xl font-bold text-gray-900">{groupMembers.length}</p>
          </div>
        </div>

        {/* Tổng lượt đặt */}
        <div className="bg-white rounded-lg shadow-md p-6 border flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <FaCar className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Tổng lượt đặt xe</p>
            <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
          </div>
        </div>

        {/* Hoàn tất */}
        <div className="bg-white rounded-lg shadow-md p-6 border flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <FaCheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Hoàn tất</p>
            <p className="text-2xl font-bold text-gray-900">{statusCounts["Hoàn tất"] || 0}</p>
          </div>
        </div>

        {/* Chờ duyệt */}
        <div className="bg-white rounded-lg shadow-md p-6 border flex items-center">
          <div className="p-3 rounded-full bg-yellow-100">
            <FaClock className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
            <p className="text-2xl font-bold text-gray-900">{statusCounts["Chờ duyệt"] || 0}</p>
          </div>
        </div>
      </div>

      {/* --- LỊCH ĐẶT XE --- */}
      <Card
        title="Lịch đặt xe nhóm"
        extra={
          <Select
            value={selectedVehicle}
            onChange={setSelectedVehicle}
            style={{ width: 250 }}
          >
            <Option value="Tất cả">Tất cả xe</Option>
            {vehicleList.map((v) => (
              <Option key={v.license} value={v.name}>
                {v.name} ({v.license})
              </Option>
            ))}
          </Select>
        }
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          height="70vh"
          eventDisplay="block"
          eventContent={(eventInfo) => (
            <div
              style={{
                fontSize: "11px",
                padding: "2px 4px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <div style={{ fontWeight: "bold" }}>
                {eventInfo.event.extendedProps.member}
              </div>
              <div style={{ fontSize: "10px", opacity: 0.8 }}>
                {eventInfo.event.extendedProps.time}
              </div>
            </div>
          )}
          eventMouseEnter={(info) => {
            info.el.style.cursor = "pointer";
            info.el.title = `Thành viên: ${info.event.extendedProps.member}\nXe: ${info.event.extendedProps.vehicle} (${info.event.extendedProps.license})\nThời gian: ${info.event.extendedProps.time}\nTrạng thái: ${info.event.extendedProps.status}\nĐặt bởi: ${info.event.extendedProps.bookedBy}\nLúc: ${info.event.extendedProps.bookedAt}`;
          }}
        />
      </Card>
    </div>
  );
};

export default GroupVehicleBookingDashboard;

import React, { useState, useMemo } from "react";
import { FaUsers, FaCar, FaCheckCircle, FaClock } from "react-icons/fa";
import { Card } from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const GroupVehicleBookingDashboard = () => {
  const [groupMembers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn An",
      email: "an.nguyen@example.com",
      bookings: [
        { id: 1, vehicle: "Toyota Camry 2023", license: "29A-12345", date: "2025-10-15", time: "10:00 - 12:00", status: "Chờ duyệt", bookedBy: "Nguyễn Văn An", bookedAt: "2025-10-10 14:30" },
        { id: 2, vehicle: "BMW X5 2023", license: "29B-67890", date: "2025-10-17", time: "11:00 - 13:00", status: "Hoàn tất", bookedBy: "Nguyễn Văn An", bookedAt: "2025-10-12 09:15" },
        { id: 6, vehicle: "Honda CR-V 2023", license: "29C-11111", date: "2025-10-20", time: "08:00 - 10:00", status: "Hoàn tất", bookedBy: "Nguyễn Văn An", bookedAt: "2025-10-14 16:20" },
        { id: 15, vehicle: "Toyota Vios 2023", license: "29O-33333", date: "2025-10-15", time: "14:00 - 16:00", status: "Chờ duyệt", bookedBy: "Nguyễn Văn An", bookedAt: "2025-10-13 10:15" },
      ],
    },
    {
      id: 2,
      name: "Trần Thị Bình",
      email: "binh.tran@example.com",
      bookings: [
        { id: 3, vehicle: "Honda Civic 2023", license: "29D-22222", date: "2025-10-16", time: "14:00 - 16:00", status: "Hoàn tất", bookedBy: "Trần Thị Bình", bookedAt: "2025-10-11 16:45" },
        { id: 7, vehicle: "Mazda CX-5 2023", license: "29E-33333", date: "2025-10-19", time: "13:00 - 15:00", status: "Chờ duyệt", bookedBy: "Trần Thị Bình", bookedAt: "2025-10-15 10:30" },
        { id: 8, vehicle: "Hyundai Tucson 2023", license: "29F-44444", date: "2025-10-22", time: "09:30 - 11:30", status: "Hoàn tất", bookedBy: "Trần Thị Bình", bookedAt: "2025-10-16 14:15" },
        { id: 16, vehicle: "Mitsubishi Outlander 2023", license: "29P-44444", date: "2025-10-15", time: "16:00 - 18:00", status: "Hoàn tất", bookedBy: "Trần Thị Bình", bookedAt: "2025-10-12 14:30" },
      ],
    },
    {
      id: 3,
      name: "Lê Văn Cường",
      email: "cuong.le@example.com",
      bookings: [
        { id: 4, vehicle: "Tesla Model 3 2023", license: "29G-55555", date: "2025-10-14", time: "09:00 - 11:00", status: "Hoàn tất", bookedBy: "Lê Văn Cường", bookedAt: "2025-10-09 11:20" },
        { id: 5, vehicle: "Ford F-150 2023", license: "29H-66666", date: "2025-10-18", time: "15:00 - 17:00", status: "Hoàn tất", bookedBy: "Lê Văn Cường", bookedAt: "2025-10-13 08:30" },
        { id: 9, vehicle: "Audi Q7 2023", license: "29I-77777", date: "2025-10-21", time: "12:00 - 14:00", status: "Hoàn tất", bookedBy: "Lê Văn Cường", bookedAt: "2025-10-17 15:45" },
        { id: 17, vehicle: "Subaru Forester 2023", license: "29Q-55555", date: "2025-10-15", time: "19:00 - 21:00", status: "Hoàn tất", bookedBy: "Lê Văn Cường", bookedAt: "2025-10-14 09:45" },
      ],
    },
    {
      id: 4,
      name: "Phạm Thị Dung",
      email: "dung.pham@example.com",
      bookings: [
        { id: 10, vehicle: "Mercedes C-Class 2023", license: "29J-88888", date: "2025-10-23", time: "16:00 - 18:00", status: "Hoàn tất", bookedBy: "Phạm Thị Dung", bookedAt: "2025-10-18 09:20" },
        { id: 11, vehicle: "Volkswagen Tiguan 2023", license: "29K-99999", date: "2025-10-25", time: "07:30 - 09:30", status: "Chờ duyệt", bookedBy: "Phạm Thị Dung", bookedAt: "2025-10-19 13:10" },
        { id: 18, vehicle: "Peugeot 3008 2023", license: "29R-66666", date: "2025-10-15", time: "20:00 - 22:00", status: "Hoàn tất", bookedBy: "Phạm Thị Dung", bookedAt: "2025-10-11 16:20" },
      ],
    },
    {
      id: 5,
      name: "Hoàng Văn Em",
      email: "em.hoang@example.com",
      bookings: [
        { id: 12, vehicle: "Lexus RX 2023", license: "29L-00000", date: "2025-10-24", time: "11:00 - 13:00", status: "Hoàn tất", bookedBy: "Hoàng Văn Em", bookedAt: "2025-10-20 11:35" },
        { id: 13, vehicle: "Nissan X-Trail 2023", license: "29M-11111", date: "2025-10-26", time: "14:30 - 16:30", status: "Hoàn tất", bookedBy: "Hoàng Văn Em", bookedAt: "2025-10-21 08:50" },
        { id: 14, vehicle: "Kia Sorento 2023", license: "29N-22222", date: "2025-10-28", time: "10:15 - 12:15", status: "Hoàn tất", bookedBy: "Hoàng Văn Em", bookedAt: "2025-10-22 16:25" },
      ],
    },
  ]);

  const statusColors = { "Chờ duyệt": "orange", "Hoàn tất": "green" };

  const calendarEvents = useMemo(
    () =>
      groupMembers.flatMap((m) =>
        m.bookings.map((b) => ({
          title: `${m.name} - ${b.vehicle}`,
          start: b.date,
          color: statusColors[b.status],
          extendedProps: { ...b, member: m.name },
        }))
      ),
    [groupMembers]
  );

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

      {/* --- THỐNG KÊ NHANH --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Tổng thành viên */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center">
          <div className="p-3 rounded-full bg-blue-100">
            <FaUsers className="w-6 h-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Tổng số thành viên</p>
            <p className="text-2xl font-bold text-gray-900">{groupMembers.length}</p>
          </div>
        </div>

        {/* Tổng lượt đặt */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center">
          <div className="p-3 rounded-full bg-green-100">
            <FaCar className="w-6 h-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Tổng lượt đặt xe</p>
            <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
          </div>
        </div>

        {/* Hoàn tất */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center">
          <div className="p-3 rounded-full bg-purple-100">
            <FaCheckCircle className="w-6 h-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Hoàn tất</p>
            <p className="text-2xl font-bold text-gray-900">{statusCounts["Hoàn tất"] || 0}</p>
          </div>
        </div>

        {/* Chờ duyệt */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex items-center">
          <div className="p-3 rounded-full bg-yellow-100">
            <FaClock className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Chờ duyệt</p>
            <p className="text-2xl font-bold text-gray-900">{statusCounts["Chờ duyệt"] || 0}</p>
          </div>
        </div>
      </div>

      {/* --- LỊCH ĐẶT XE NHÓM (GIỮ NGUYÊN STYLE CŨ) --- */}
      <Card title="Lịch đặt xe nhóm" style={{ marginBottom: 16 }}>
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
              <div style={{ fontWeight: "bold" }}>{eventInfo.event.extendedProps.member}</div>
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

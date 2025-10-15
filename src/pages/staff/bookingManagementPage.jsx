import React, { useState, useMemo } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Table,
  Select,
  Input,
  DatePicker,
  Typography,
  Space,
  Button,
  Statistic,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  CarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


const { Title } = Typography;
const { Option } = Select;

const GroupVehicleBookingDashboard = () => {
  const [groupMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      bookings: [
        {
          id: 1,
          vehicle: "Toyota Camry 2023",
          license: "ABC-123",
          date: "2024-02-15",
          time: "10:00 - 12:00",
          status: "Pending",
        },
        {
          id: 2,
          vehicle: "BMW X5 2023",
          license: "GHI-789",
          date: "2024-02-17",
          time: "11:00 - 13:00",
          status: "Completed",
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      bookings: [
        {
          id: 3,
          vehicle: "Honda Civic 2023",
          license: "XYZ-789",
          date: "2024-02-16",
          time: "14:00 - 16:00",
          status: "Confirmed",
        },
      ],
    },
    {
      id: 3,
      name: "Bob Wilson",
      email: "bob@example.com",
      bookings: [
        {
          id: 4,
          vehicle: "Tesla Model 3 2023",
          license: "DEF-456",
          date: "2024-02-14",
          time: "09:00 - 11:00",
          status: "In Progress",
        },
        {
          id: 5,
          vehicle: "Ford F-150 2023",
          license: "JKL-012",
          date: "2024-02-18",
          time: "15:00 - 17:00",
          status: "Cancelled",
        },
      ],
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");
  const [dateFilter, setDateFilter] = useState(null);

  const statusColors = {
    Pending: "gold",
    Confirmed: "green",
    "In Progress": "blue",
    Completed: "gray",
    Cancelled: "red",
  };

  const filterBookings = (bookings) => {
    return bookings.filter((b) => {
      const matchesStatus =
        statusFilter === "All Status" || b.status === statusFilter;
      const matchesVehicle =
        vehicleFilter === "All Vehicles" || b.vehicle === vehicleFilter;
      const matchesDate =
        !dateFilter || b.date === dateFilter.format("YYYY-MM-DD");
      return matchesStatus && matchesVehicle && matchesDate;
    });
  };

  const columns = [
    {
      title: "Vehicle",
      align: "center",
      render: (record) => (
        <>
          <div>{record.vehicle}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.license}</div>
        </>
      ),
    },
    {
      title: "Date & Time",
      align: "center",
      render: (record) => (
        <>
          <div>{record.date}</div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.time}</div>
        </>
      ),
    },
    {
      title: "Status",
      align: "center",
      render: (record) => (
        <Tag color={statusColors[record.status]}>{record.status}</Tag>
      ),
    },
    {
      title: "Actions",
      align: "center",
      render: () => (
        <Space>
          <Button icon={<EyeOutlined />} type="link" />
          <Button icon={<EditOutlined />} type="link" />
          <Button icon={<CheckOutlined />} type="link" />
          <Button icon={<CloseOutlined />} danger type="link" />
        </Space>
      ),
    },
  ];

  // Filtered members and bookings
  const filteredMembers = groupMembers
    .filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase())
    )
    .map((m) => ({
      ...m,
      bookings: filterBookings(m.bookings),
    }));

  // Convert all bookings into events for FullCalendar
  const calendarEvents = useMemo(() => {
    return groupMembers.flatMap((m) =>
      m.bookings.map((b) => ({
        title: `${b.vehicle} (${m.name})`,
        start: b.date,
        color: statusColors[b.status],
        extendedProps: {
          member: m.name,
          status: b.status,
        },
      }))
    );
  }, [groupMembers]);

  // Booking summary
  const totalBookings = groupMembers.reduce(
    (sum, m) => sum + m.bookings.length,
    0
  );
  const statusCounts = Object.keys(statusColors).reduce((acc, key) => {
    acc[key] = groupMembers.flatMap((m) => m.bookings).filter((b) => b.status === key).length;
    return acc;
  }, {});

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Group Vehicle Booking Dashboard</Title>

      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={12} md={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={totalBookings}
              prefix={<CarOutlined />}
            />
          </Card>
        </Col>
        {Object.entries(statusCounts).map(([status, count]) => (
          <Col xs={12} md={4} key={status}>
            <Card>
              <Statistic
                title={status}
                value={count}
                valueStyle={{ color: statusColors[status] }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Input
              placeholder="Search member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={12} md={4}>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: "100%" }}
            >
              <Option>All Status</Option>
              <Option>Pending</Option>
              <Option>Confirmed</Option>
              <Option>In Progress</Option>
              <Option>Completed</Option>
              <Option>Cancelled</Option>
            </Select>
          </Col>
          <Col xs={12} md={4}>
            <Select
              value={vehicleFilter}
              onChange={setVehicleFilter}
              style={{ width: "100%" }}
            >
              <Option>All Vehicles</Option>
              <Option>Toyota Camry 2023</Option>
              <Option>Honda Civic 2023</Option>
              <Option>Tesla Model 3 2023</Option>
              <Option>BMW X5 2023</Option>
              <Option>Ford F-150 2023</Option>
            </Select>
          </Col>
          <Col xs={24} md={4}>
            <DatePicker
              value={dateFilter}
              onChange={setDateFilter}
              style={{ width: "100%" }}
              placeholder="Filter by date"
            />
          </Col>
        </Row>
      </Card>

      {/* Calendar View */}
      <Card title="Team Booking Calendar" style={{ marginBottom: 16 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          height="70vh"
          eventDisplay="block"
        />
      </Card>

      {/* Member Cards */}
      <Row gutter={[16, 16]}>
        {filteredMembers.map((member) => (
          <Col xs={24} md={12} lg={8} key={member.id}>
            <Card
              title={
                <div>
                  <UserOutlined style={{ marginRight: 8 }} />
                  <strong>{member.name}</strong>
                  <div style={{ color: "#888", fontSize: 12 }}>{member.email}</div>
                </div>
              }
              bordered
              hoverable
              style={{ borderRadius: 12 }}
            >
              {member.bookings.length > 0 ? (
                <Table
                  columns={columns}
                  dataSource={member.bookings}
                  rowKey="id"
                  pagination={false}
                  size="small"
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "#999",
                    padding: "20px 0",
                  }}
                >
                  No bookings found
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default GroupVehicleBookingDashboard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import {
  Card,
  Input,
  Select,
  Row,
  Col,
  Tag,
  Typography,
  Pagination,
  Space,
} from "antd";
import {
  SearchOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const WarehousePage = () => {
  const navigate = useNavigate();
  const [vehicles] = useState([
    {
      id: 1,
      name: "Toyota Camry 2023",
      license: "ABC-123",
      type: "Sedan",
      status: "Available",
      location: "Garage A",
      mileage: 15000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      color: "White",
      year: 2023,
      price: 850000000,
    },
    {
      id: 3,
      name: "Tesla Model 3 2023",
      license: "DEF-456",
      type: "Electric",
      status: "Available",
      location: "Garage B",
      mileage: 8000,
      fuelType: "Electric",
      transmission: "Automatic",
      color: "Black",
      year: 2023,
      price: 1200000000,
    },
    {
      id: 4,
      name: "BMW X5 2023",
      license: "GHI-789",
      type: "SUV",
      status: "Maintenance",
      location: "Service Bay 1",
      mileage: 18000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      color: "Blue",
      year: 2023,
      price: 1500000000,
    },
    {
      id: 7,
      name: "Mercedes C-Class 2023",
      license: "PQR-678",
      type: "Sedan",
      status: "In Service",
      location: "Service Bay 3",
      mileage: 14000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      color: "White",
      year: 2023,
      price: 1300000000,
    },
    {
      id: 8,
      name: "Volkswagen Golf 2023",
      license: "STU-901",
      type: "Hatchback",
      status: "Available",
      location: "Garage B",
      mileage: 16000,
      fuelType: "Gasoline",
      transmission: "Manual",
      color: "Yellow",
      year: 2023,
      price: 650000000,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filteredVehicles = vehicles.filter((v) => {
    const search = searchTerm.toLowerCase();
    const matchSearch =
      v.name.toLowerCase().includes(search) ||
      v.license.toLowerCase().includes(search);
    const matchStatus = statusFilter === "All" || v.status === statusFilter;
    const matchType = typeFilter === "All" || v.type === typeFilter;
    const matchLocation = locationFilter === "All" || v.location === locationFilter;
    return matchSearch && matchStatus && matchType && matchLocation;
  });

  const statusTag = (status) => {
    const colors = {
      Available: "green",
      "In Service": "blue",
      Maintenance: "gold",
      Unavailable: "red",
    };
    return <Tag color={colors[status] || "default"}>{status}</Tag>;
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fa",
      }}
    >
 
      <Header />
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={2} style={{ color: "#222", marginBottom: 4 }}>
          🚘 Kho xe đồng sở hữu
        </Title>
        <Text style={{ color: "#666", fontSize: 16 }}>
          Khám phá danh mục EV phù hợp cho đồng sở hữu — hiện đại, tiết kiệm, sang trọng.
        </Text>
      </div>

      {/* Filters */}
      <Space
        style={{
          marginBottom: 32,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm xe theo tên hoặc biển số..."
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: 300,
          }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 160 }}
          options={[
            { value: "All", label: "Tất cả trạng thái" },
            { value: "Available", label: "Available" },
            { value: "In Service", label: "In Service" },
            { value: "Maintenance", label: "Maintenance" },
          ]}
        />
        <Select
          value={typeFilter}
          onChange={setTypeFilter}
          style={{ width: 140 }}
          options={[
            { value: "All", label: "Tất cả loại xe" },
            { value: "Sedan", label: "Sedan" },
            { value: "SUV", label: "SUV" },
            { value: "Hatchback", label: "Hatchback" },
            { value: "Electric", label: "Electric" },
          ]}
        />
        <Select
          value={locationFilter}
          onChange={setLocationFilter}
          style={{ width: 180 }}
          options={[
            { value: "All", label: "Tất cả vị trí" },
            { value: "Garage A", label: "Garage A" },
            { value: "Garage B", label: "Garage B" },
            { value: "Garage C", label: "Garage C" },
            { value: "Service Bay 1", label: "Service Bay 1" },
            { value: "Service Bay 3", label: "Service Bay 3" },
          ]}
        />
      </Space>

      {/* Vehicle Grid */}
      <Row gutter={[24, 24]}>
        {filteredVehicles.map((vehicle) => (
          <Col xs={24} sm={12} md={8} key={vehicle.id}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                overflow: "hidden",
                boxShadow:
                  "0 6px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0,0,0,0.04)",
                transform: "translateY(0)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              cover={
                <img
                  alt={vehicle.name}
                  src="https://images.unsplash.com/photo-1555215695-3004980ad54e"
                  style={{
                    height: 180,
                    objectFit: "cover",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    transition: "transform 0.4s ease",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                />
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0,0,0,0.04)";
              }}
              onClick={() => navigate(`/car/${vehicle.id}`)}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                {statusTag(vehicle.status)}
                <Text type="secondary">#{vehicle.id.toString().padStart(3, "0")}</Text>
              </div>
              <Title level={4} style={{ marginBottom: 0 }}>
                {vehicle.name}
              </Title>
              <Text type="secondary">
                {vehicle.type} - {vehicle.fuelType}
              </Text>

              <div style={{ marginTop: 12 }}>
                <Text strong style={{ color: "#1677ff", fontSize: 18 }}>
                  {formatPrice(vehicle.price)}
                </Text>
              </div>

            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <div style={{ textAlign: "center", marginTop: 40, marginBottom: 40 }}>
        <Pagination
          current={page}
          total={filteredVehicles.length}
          pageSize={6}
          onChange={setPage}
        />
      </div>
      <Footer />
    </div>
  );
};

export default WarehousePage;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Card, Row, Col, Typography, Pagination } from "antd";

const { Title, Text } = Typography;

const WarehousePage = () => {
  const navigate = useNavigate();

  // Danh sách xe cố định
  const [vehicles] = useState([
    {
      id: 1,
      name: "Toyota Camry 2023",
      license: "ABC-123",
      type: "Sedan",
      location: "Garage A",
      mileage: 15000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      color: "White",
      year: 2023,
    },
    {
      id: 3,
      name: "Tesla Model 3 2023",
      license: "DEF-456",
      type: "Electric",
      location: "Garage B",
      mileage: 8000,
      fuelType: "Electric",
      transmission: "Automatic",
      color: "Black",
      year: 2023,
    },
    {
      id: 4,
      name: "BMW X5 2023",
      license: "GHI-789",
      type: "SUV",
      location: "Service Bay 1",
      mileage: 18000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      color: "Blue",
      year: 2023,
    },
    {
      id: 7,
      name: "Mercedes C-Class 2023",
      license: "PQR-678",
      type: "Sedan",
      location: "Service Bay 3",
      mileage: 14000,
      fuelType: "Gasoline",
      transmission: "Automatic",
      color: "White",
      year: 2023,
    },
    {
      id: 8,
      name: "Volkswagen Golf 2023",
      license: "STU-901",
      type: "Hatchback",
      location: "Garage B",
      mileage: 16000,
      fuelType: "Gasoline",
      transmission: "Manual",
      color: "Yellow",
      year: 2023,
    },
  ]);

  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Tính toán danh sách xe cho từng trang
  const startIndex = (page - 1) * pageSize;
  const currentVehicles = vehicles.slice(startIndex, startIndex + pageSize);

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Header />

      {/* Tiêu đề trang */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={2} style={{ color: "#222", marginBottom: 4 }}>
          🚘 Kho xe đồng sở hữu
        </Title>
        <Text style={{ color: "#666", fontSize: 16 }}>
          Khám phá danh mục EV phù hợp cho đồng sở hữu — hiện đại, tiết kiệm, sang trọng.
        </Text>
      </div>

      {/* Danh sách xe */}
      <Row gutter={[24, 24]} style={{ padding: "0 40px" }}>
        {currentVehicles.map((vehicle) => (
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
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.05)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1.0)")
                  }
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
              <Title level={4} style={{ marginBottom: 4 }}>
                {vehicle.name}
              </Title>
              <Text type="secondary">
                {vehicle.type} • {vehicle.fuelType} • {vehicle.color}
              </Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                </Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Phân trang */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 40,
          marginBottom: 40,
          background: "#f9f9f9",
          padding: "20px 0",
          borderRadius: 12,
        }}
      >
        <Pagination
          current={page}
          total={vehicles.length}
          pageSize={pageSize}
          onChange={setPage}
          showSizeChanger={false}
        />
      </div>

      <Footer />
    </div>
  );
};

export default WarehousePage;

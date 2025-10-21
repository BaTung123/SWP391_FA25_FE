import React, { useState } from "react";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import { Card, Row, Col, Typography, Pagination } from "antd";

const { Title, Text } = Typography;

const WarehousePage = () => {
  // Danh sách xe cố định
  const [vehicles] = useState([
    {
      id: 1,
      name: "Toyota Camry 2023",
      license: "ABC-123",
      type: "Sedan",
      fuelType: "Gasoline",
      color: "White",
    },
    {
      id: 2,
      name: "Tesla Model 3 2023",
      license: "DEF-456",
      type: "Electric",
      fuelType: "Electric",
      color: "Black",
    },
    {
      id: 3,
      name: "BMW X5 2023",
      license: "GHI-789",
      type: "SUV",
      fuelType: "Gasoline",
      color: "Blue",
    },
    {
      id: 4,
      name: "Mercedes C-Class 2023",
      license: "PQR-678",
      type: "Sedan",
      fuelType: "Gasoline",
      color: "White",
    },
    {
      id: 5,
      name: "Volkswagen Golf 2023",
      license: "STU-901",
      type: "Hatchback",
      fuelType: "Gasoline",
      color: "Yellow",
    },
    {
      id: 6,
      name: "VinFast VF8",
      license: "VIN-888",
      type: "Electric",
      fuelType: "Electric",
      color: "Silver",
    },
    {
      id: 7,
      name: "Hyundai Ioniq 5",
      license: "HYN-505",
      type: "Electric",
      fuelType: "Electric",
      color: "Gray",
    },
    {
      id: 8,
      name: "Kia EV6",
      license: "KIA-606",
      type: "Electric",
      fuelType: "Electric",
      color: "Red",
    },
  ]);

  const [page, setPage] = useState(1);
  const pageSize = 8;

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
          <Col xs={24} sm={12} md={12} lg={6} key={vehicle.id}>
            <Card
              hoverable
              style={{
                borderRadius: 16,
                overflow: "hidden",
                boxShadow:
                  "0 6px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
                cursor: "default", // bỏ con trỏ click
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
            >
              <Title level={4} style={{ marginBottom: 4 }}>
                {vehicle.name}
              </Title>
              <Text type="secondary">
                {vehicle.type} • {vehicle.fuelType} • {vehicle.color}
              </Text>
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

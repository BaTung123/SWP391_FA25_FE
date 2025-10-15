import React from "react";
import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Button,
  Divider,
  theme,
} from "antd";
import {
  BookOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const AboutPage = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      {/* HERO */}
      <section
        style={{
          background: "white",
          padding: "80px 0 50px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          <Title level={2} style={{ color: "#111", marginBottom: 12 }}>
            Đồng Sở Hữu Ô Tô Điện & Hệ Thống Chia Sẻ Chi Phí
          </Title>
          <Text type="secondary" style={{ fontSize: 16 }}>
            Mô hình cùng sở hữu EV, tối ưu chi phí – tối đa trải nghiệm
          </Text>

          <div
            style={{
              borderRadius: 16,
              overflow: "hidden",
              marginTop: 32,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src="https://media-cdn-v2.laodong.vn/storage/newsportal/2022/3/30/1029145/Anh-Chup-Man-Hinh-20.jpg?w=800&h=420&crop=auto&scale=both"
              alt="Xe điện và người dùng"
              style={{ width: "100%", height: 420, objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* BODY */}
      <Content style={{ background: colorBgContainer, padding: "40px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px" }}>
          <Typography>
            <Paragraph>
              Hệ thống <strong>Đồng Sở Hữu Ô Tô Điện (EV Co-ownership)</strong>{" "}
              cho phép nhiều người cùng góp vốn sở hữu một chiếc EV, sử dụng
              lịch đặt xe thông minh và cơ chế chia sẻ chi phí minh bạch. Mô hình
              này giúp giảm rào cản chi phí ban đầu, tăng hiệu suất khai thác
              phương tiện và thúc đẩy chuyển dịch xanh trong giao thông đô thị.
            </Paragraph>

            <Paragraph>
              Nền tảng cung cấp quản lý quyền sở hữu theo tỷ lệ, định mức sử
              dụng, theo dõi chi phí (sạc, bảo trì, bãi đỗ), cùng bộ quy tắc
              công bằng để giải quyết xung đột. Tất cả đều được số hóa: hợp
              đồng, lịch đặt, thanh toán và báo cáo.
            </Paragraph>

            <div
              style={{
                borderLeft: "4px solid #1677ff",
                paddingLeft: 20,
                margin: "32px 0",
              }}
            >
              <Paragraph italic style={{ fontSize: 18, color: "#111" }}>
                “Sở hữu xe điện trở nên khả thi hơn khi chúng ta cùng chia sẻ
                trách nhiệm và lợi ích.”
              </Paragraph>
              <Text type="secondary">— Tuyên ngôn sản phẩm EV Co-ownership</Text>
            </div>

            <Paragraph>
              Thuật toán phân bổ suất sử dụng dựa trên tỉ lệ sở hữu, ưu tiên theo
              bối cảnh (giờ cao điểm, ngày lễ), và khả năng hoán đổi giữa các
              đồng sở hữu. Mọi phát sinh đều được phản ánh ngay vào sổ cái chi
              phí và ví nhóm.
            </Paragraph>

            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                margin: "32px 0",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              }}
            >
              <img
                src="https://png.pngtree.com/png-vector/20240203/ourlarge/pngtree-electric-car-charging-at-station-with-solar-panel-stand-street-lamps-png-image_11534831.png"
                alt="Sạc xe điện và bảng điều khiển"
                style={{ width: "100%", height: 360, objectFit: "cover" }}
              />
            </div>

            <Paragraph>
              Minh bạch là cốt lõi: bảng điều khiển hiển thị chi tiết từng
              chuyến đi, kWh tiêu thụ, phí sạc, bảo trì định kỳ và phân chia chi
              phí theo thời gian thực. Chủ nhóm có thể đặt ngưỡng ngân sách,
              nhận cảnh báo và xuất báo cáo theo tháng hoặc quý.
            </Paragraph>
          </Typography>
        </div>
      </Content>

      {/* POPULAR TOPICS */}
      <section style={{ background: "#fff", padding: "60px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Col>
              <Title level={3} style={{ marginBottom: 0 }}>
                Chủ đề nổi bật
              </Title>
            </Col>
    
          </Row>

          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                cover={
                  <img
                    alt="Mô hình chia sẻ chi phí"
                    src="https://base.vn/wp-content/uploads/2024/02/lean-la-gi.jpg"
                    style={{ height: 180, objectFit: "cover" }}
                  />
                }
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <ThunderboltOutlined /> Chiến lược • 12 phút trước
                </Text>
                <Title level={5} style={{ marginTop: 8 }}>
                  Thiết kế công thức chia sẻ chi phí công bằng cho EV
                </Title>
                <Paragraph type="secondary">
                  Cân bằng giữa tỉ lệ sở hữu, thời lượng sử dụng và chi phí bảo
                  trì thực tế.
                </Paragraph>
                <Button type="link" size="small">
                  Đọc tiếp…
                </Button>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                cover={
                  <img
                    alt="Lập lịch dùng xe"
                    src="https://cdn.tgdd.vn/2020/10/campaign/thumb-640x360-12.jpg"
                    style={{ height: 180, objectFit: "cover" }}
                  />
                }
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <CalendarOutlined /> Vận hành • 2 giờ trước
                </Text>
                <Title level={5} style={{ marginTop: 8 }}>
                  Lập lịch và ưu tiên đặt chỗ trong nhóm đồng sở hữu
                </Title>
                <Paragraph type="secondary">
                  Nguyên tắc công bằng, tránh xung đột, và cách hoán đổi suất sử
                  dụng.
                </Paragraph>
                <Button type="link" size="small">
                  Đọc tiếp…
                </Button>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                cover={
                  <img
                    alt="Sạc nhanh và chi phí"
                    src="https://sohanews.sohacdn.com/160588918557773824/2023/4/22/photo-3-168213013416868043325.jpg"
                    style={{ height: 180, objectFit: "cover" }}
                  />
                }
              >
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <BookOutlined /> Kỹ thuật • Hôm qua
                </Text>
                <Title level={5} style={{ marginTop: 8 }}>
                  Theo dõi kWh, tối ưu chi phí sạc và bảo trì
                </Title>
                <Paragraph type="secondary">
                  Bộ chỉ số quan trọng giúp nhóm đưa ra quyết định chính xác
                  theo thời gian thực.
                </Paragraph>
                <Button type="link" size="small">
                  Đọc tiếp…
                </Button>
              </Card>
            </Col>
          </Row>
        </div>
      </section>

      <Divider style={{ margin: "0" }} />
    </Layout>
  );
};

export default AboutPage;

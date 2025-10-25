import React, { useEffect, useState } from "react";
import Footer from "../../components/footer/footer";
import { Layout, Typography, Row, Col, Card, Button, Divider, Statistic } from "antd";
import {
  BookOutlined,
  ThunderboltOutlined,
  CalendarOutlined,
  UserOutlined,
  CarOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

// Animation variants for sections
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8
    }
  }
};

// Animation variants for features
const featureVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5
    }
  }
};

const AboutPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Layout style={{ background: "#f5f7fa", minHeight: "100vh" }}>
      {/* HERO SECTION */}
      <section 
        style={{ 
          height: "100vh", 
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div 
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: `translateY(${scrollY * 0.5}px)`,
            transition: "transform 0.1s ease-out",
            zIndex: 0
          }}
        >
          <img
            src="https://media-cdn-v2.laodong.vn/storage/newsportal/2022/3/30/1029145/Anh-Chup-Man-Hinh-20.jpg?w=800&h=420&crop=auto&scale=both"
            alt="Xe điện và người dùng"
            style={{ 
              width: "100%", 
              height: "100%", 
              objectFit: "cover",
              filter: "brightness(0.7)"
            }}
          />
        </div>
        <motion.div 
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          style={{ 
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            color: "white",
            maxWidth: "800px",
            margin: "0 40px"
          }}
        >
          <Title level={1} style={{ color: "white", fontSize: "3.5rem", marginBottom: "1rem" }}>
            Đồng Sở Hữu Ô Tô Điện
          </Title>
          <Title level={3} style={{ color: "white", fontWeight: "normal", marginTop: 0 }}>
            Tối ưu chi phí – Tối đa trải nghiệm
          </Title>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Button type="primary" size="large" style={{ marginTop: "2rem" }}>
              Tìm hiểu thêm
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS SECTION */}
      <section style={{ background: "white", padding: "60px 0" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={8}>
              <motion.div
                variants={featureVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Card hoverable style={{ textAlign: "center", height: "100%" }}>
                  <UserOutlined style={{ fontSize: 36, color: "#1677ff", marginBottom: 16 }} />
                  <Statistic title="Người dùng hài lòng" value={5000} suffix="+" />
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} sm={8}>
              <motion.div
                variants={featureVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Card hoverable style={{ textAlign: "center", height: "100%" }}>
                  <CarOutlined style={{ fontSize: 36, color: "#1677ff", marginBottom: 16 }} />
                  <Statistic title="Xe điện đang chia sẻ" value={200} suffix="+" />
                </Card>
              </motion.div>
            </Col>
            <Col xs={24} sm={8}>
              <motion.div
                variants={featureVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Card hoverable style={{ textAlign: "center", height: "100%" }}>
                  <DollarOutlined style={{ fontSize: 36, color: "#1677ff", marginBottom: 16 }} />
                  <Statistic title="Tiết kiệm chi phí" value={30} suffix="%" />
                </Card>
              </motion.div>
            </Col>
          </Row>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <Content style={{ 
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)",
        padding: "80px 0",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px", position: "relative" }}>
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Typography>
                  <Title 
                    level={2} 
                    style={{ 
                      marginBottom: 24,
                      background: "linear-gradient(120deg, #1677ff 0%, #69b1ff 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: "2.5rem"
                    }}
                  >
                    Giải pháp đồng sở hữu thông minh
                  </Title>
                  <Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: "#666" }}>
                    Hệ thống <strong style={{ color: "#1677ff" }}>Đồng Sở Hữu Ô Tô Điện (EV Co-ownership)</strong>{" "}
                    cho phép nhiều người cùng góp vốn sở hữu một chiếc EV, sử dụng
                    lịch đặt xe thông minh và cơ chế chia sẻ chi phí minh bạch. Mô hình
                    này giúp giảm rào cản chi phí ban đầu, tăng hiệu suất khai thác
                    phương tiện và thúc đẩy chuyển dịch xanh trong giao thông đô thị.
                  </Paragraph>

                  <div style={{ marginTop: 32 }}>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} sm={12}>
                        <motion.div
                          variants={featureVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            padding: "24px",
                            background: "rgba(255, 255, 255, 0.8)",
                            borderRadius: 12,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                          }}
                        >
                          <ThunderboltOutlined style={{ fontSize: 24, color: "#1677ff", marginBottom: 12 }} />
                          <Text strong style={{ display: "block", marginBottom: 8, fontSize: 16 }}>
                            Quản lý quyền sở hữu
                          </Text>
                          <Text type="secondary">Phân chia tỷ lệ sở hữu linh hoạt và công bằng</Text>
                        </motion.div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <motion.div
                          variants={featureVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            padding: "24px",
                            background: "rgba(255, 255, 255, 0.8)",
                            borderRadius: 12,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                          }}
                        >
                          <CalendarOutlined style={{ fontSize: 24, color: "#1677ff", marginBottom: 12 }} />
                          <Text strong style={{ display: "block", marginBottom: 8, fontSize: 16 }}>
                            Định mức sử dụng
                          </Text>
                          <Text type="secondary">Lịch trình thông minh, tối ưu thời gian</Text>
                        </motion.div>
                      </Col>
                    </Row>
                  </div>
                </Typography>
              </motion.div>
            </Col>
            <Col xs={24} lg={12}>
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
                  background: "#fff",
                  padding: "20px",
                }}
              >
                <img
                  src="https://png.pngtree.com/png-vector/20240203/ourlarge/pngtree-electric-car-charging-at-station-with-solar-panel-stand-street-lamps-png-image_11534831.png"
                  alt="Sạc xe điện và bảng điều khiển"
                  style={{ 
                    width: "100%", 
                    height: "auto", 
                    objectFit: "contain",
                    borderRadius: 12,
                    transition: "transform 0.3s ease-in-out"
                  }}
                />
              </motion.div>
            </Col>
          </Row>
        </div>
      </Content>

      {/* POPULAR TOPICS */}
      <section style={{ background: "#fff", padding: "60px 0" }}>
        <div style={{ maxWidth: 1500, margin: "0 auto", padding: "0 40px" }}>
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
              <Col>
                <Title level={3} style={{ marginBottom: 0 }}>
                  Chủ đề nổi bật
                </Title>
              </Col>
            </Row>

            <Row gutter={[24, 24]}>
              <Col xs={24} sm={12} lg={8}>
                <motion.div
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <Card
                    hoverable
                    cover={
                      <img
                        alt="Mô hình chia sẻ chi phí"
                        src="https://base.vn/wp-content/uploads/2024/02/lean-la-gi.jpg"
                        style={{ height: 200, objectFit: "cover" }}
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
                </motion.div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <motion.div
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Card
                    hoverable
                    cover={
                      <img
                        alt="Lập lịch dùng xe"
                        src="https://cdn.tgdd.vn/2020/10/campaign/thumb-640x360-12.jpg"
                        style={{ height: 200, objectFit: "cover" }}
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
                </motion.div>
              </Col>

              <Col xs={24} sm={12} lg={8}>
                <motion.div
                  variants={featureVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <Card
                    hoverable
                    cover={
                      <img
                        alt="Sạc nhanh và chi phí"
                        src="https://sohanews.sohacdn.com/160588918557773824/2023/4/22/photo-3-168213013416868043325.jpg"
                        style={{ height: 200, objectFit: "cover" }}
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
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </div>
      </section>

      <Divider style={{ margin: "0" }} />
      <Footer />
    </Layout>
  );
};

export default AboutPage;
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  message,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import logoGarage from "../../assets/logo.png";
import bgImage from "../../assets/3408105.jpg";
import api from "../../config/axios";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      await api.post("/User/register", {
        userName: values.userName,   // KHÔNG dùng fullName làm userName
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: 0,                     // ✅ mặc định Member
      });

      message.success("Đăng ký thành công!");
      navigate("/auth/login", { replace: true });
    } catch (error) {
      const data = error?.response?.data || {};
      const msg =
        data.message ||
        (data.errors ? Object.values(data.errors).flat().join(", ") : "") ||
        error.message;

      if (
        (data.title || "").toLowerCase().includes("exist") ||
        /exist|already/i.test(msg)
      ) {
        message.error("Tài khoản đã tồn tại. Vui lòng chọn tên đăng nhập/email khác.");
      } else {
        message.error(msg || "Đăng ký thất bại. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeZoom {
          0% { opacity: 0; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        .logo-anim {
          animation: fadeZoom 1.2s ease-out both;
          will-change: opacity, transform;
        }
      `}</style>

      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(7,89,133,0.45), rgba(3,105,161,0.45)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden">
          <Row className="min-h-[600px]">
            {/* TRÁI: FORM ĐĂNG KÝ */}
            <Col xs={24} lg={12} className="p-10 flex items-center">
              <div className="w-full max-w-md mx-auto">
                <Title level={2} className="text-gray-800 mb-2">
                  Tạo tài khoản
                </Title>
                <Text type="secondary" className="block mb-8">
                  Điền thông tin bên dưới để bắt đầu
                </Text>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{
                    fullName: "",
                    userName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  }}
                >
                  <Form.Item
                    label="Họ và tên"
                    name="fullName"
                    rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
                  >
                    <Input placeholder="VD: Nguyễn Văn A" />
                  </Form.Item>

                  <Form.Item
                    label="Tên đăng nhập"
                    name="userName"
                    rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
                  >
                    <Input placeholder="Chọn tên đăng nhập" />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: "Vui lòng nhập email!" },
                      { type: "email", message: "Định dạng email không hợp lệ!" },
                    ]}
                  >
                    <Input placeholder="VD: ban@vidu.com" />
                  </Form.Item>

                  <Form.Item
                    label="Mật khẩu"
                    name="password"
                    rules={[
                      { required: true, message: "Vui lòng nhập mật khẩu!" },
                      { min: 6, message: "Mật khẩu tối thiểu 6 ký tự!" },
                    ]}
                  >
                    <Input.Password
                      placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value)
                            return Promise.resolve();
                          return Promise.reject(new Error("Mật khẩu xác nhận không khớp!"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="Nhập lại mật khẩu"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      className="font-semibold"
                      loading={isLoading}
                    >
                      Tạo tài khoản
                    </Button>
                  </Form.Item>

                  <div className="text-center mt-6">
                    <Text type="secondary">
                      Đã có tài khoản?{" "}
                      <Link
                        to="/auth/login"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Đăng nhập
                      </Link>
                    </Text>
                  </div>

                  <div className="mt-4 text-center">
                    <Link
                      to="/"
                      className="text-blue-700 font-semibold hover:underline"
                    >
                      Quay lại Trang chủ
                    </Link>
                  </div>
                </Form>
              </div>
            </Col>

            {/* PHẢI: LOGO */}
            <Col
              xs={24}
              lg={12}
              className="relative flex items-center justify-center overflow-hidden bg-white"
            >
              <div
                className="absolute inset-0 logo-anim"
                style={{
                  backgroundImage: `url(${logoGarage})`,
                  backgroundSize: "70%",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  filter: "brightness(1) contrast(1.05)",
                }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

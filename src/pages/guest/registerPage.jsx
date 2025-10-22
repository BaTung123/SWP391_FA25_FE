import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Typography,
  Radio,
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
      // Gọi API đăng ký, kèm role
      await api.post("/User/register", {
        userName: values.userName,   // KHÔNG dùng fullName làm userName
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,           // 0 = Member, 1 = Staff/Admin
      });

      message.success("Registration successful!");
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
        message.error("Tài khoản đã tồn tại. Vui lòng chọn userName/email khác.");
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
            {/* LEFT: REGISTER FORM */}
            <Col xs={24} lg={12} className="p-10 flex items-center">
              <div className="w-full max-w-md mx-auto">
                <Title level={2} className="text-gray-800 mb-2">
                  Create Account
                </Title>

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
                    role: 0, // default Member
                  }}
                >
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    rules={[{ required: true, message: "Please enter your full name!" }]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>

                  <Form.Item
                    label="User Name"
                    name="userName"
                    rules={[{ required: true, message: "Please enter your user name!" }]}
                  >
                    <Input placeholder="Choose a username" />
                  </Form.Item>

                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      { required: true, message: "Please enter your email!" },
                      { type: "email", message: "Invalid email format!" },
                    ]}
                  >
                    <Input placeholder="you@example.com" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: "Please enter your password!" },
                      { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter 6 characters or more"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please confirm your password!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) return Promise.resolve();
                          return Promise.reject(new Error("Passwords do not match!"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="Confirm your password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: "Please choose a role!" }]}
                  >
                    <Radio.Group>
                      <Radio value={0}>Member</Radio>
                      <Radio value={1}>Staff / Admin</Radio>
                    </Radio.Group>
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
                      Create Account
                    </Button>
                  </Form.Item>

                  <div className="text-center mt-6">
                    <Text type="secondary">
                      Already have an account?{" "}
                      <Link
                        to="/auth/login"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Sign In
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

            {/* RIGHT: LOGO */}
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

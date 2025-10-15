<<<<<<< Updated upstream
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
=======
import React from "react";
>>>>>>> Stashed changes
import {
  Form,
  Input,
  Button,
<<<<<<< Updated upstream
=======
  Checkbox,
>>>>>>> Stashed changes
  Row,
  Col,
  Typography,
  Divider,
  message,
} from "antd";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  GoogleOutlined,
  FacebookFilled,
} from "@ant-design/icons";
<<<<<<< Updated upstream
import api from "../../config/axios";
=======
import { Link } from "react-router-dom";
>>>>>>> Stashed changes
import logoGarage from "../../assets/logo.png";
import bgImage from "../../assets/3408105.jpg";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
<<<<<<< Updated upstream
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", values);

      localStorage.setItem("accessToken", res.data.token);
      message.success("Login successful!");
      navigate("/member/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      message.error(
        error.response?.data?.message || "Login failed, please try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
          {/* LEFT SIDE: LOGIN FORM */}
          <Col xs={24} lg={12} className="p-10 flex items-center">
            <div className="w-full max-w-md mx-auto">
              <Title level={2} className="text-gray-800 mb-2">
                Welcome Back
              </Title>

              <Form
                form={form}
                layout="vertical"
                onFinish={handleLogin}
                initialValues={{ email: "", password: "" }}
              >
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
                  ]}
                >
                  <Input.Password
                    placeholder="Enter your password"
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
                    loading={loading}
                    className="font-semibold"
                  >
                    Sign In
                  </Button>
                </Form.Item>

                <Divider plain>or login with</Divider>

                <Row gutter={16}>
                  <Col span={12}>
                    <Button block icon={<GoogleOutlined />}>
                      Google
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button
                      block
                      icon={<FacebookFilled />}
                      style={{ backgroundColor: "#1877F2", color: "white" }}
                    >
                      Facebook
                    </Button>
                  </Col>
                </Row>

                <div className="text-center mt-6">
                  <Text type="secondary">
                    Don’t have an account?{" "}
                    <Link
                      to="/auth/register"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign Up
                    </Link>
                  </Text>
                </div>
              </Form>
            </div>
          </Col>

          {/* RIGHT SIDE: LOGO */}
          <Col
            xs={24}
            lg={12}
            className="relative flex items-center justify-center bg-white"
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${logoGarage})`,
                backgroundSize: "60%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                opacity: 0.8,
              }}
            />
          </Col>
        </Row>
=======

  const handleSubmit = (values) => {
    console.log("Form submitted:", values);
    message.success("Login successful!");
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
            {/* LEFT: LOGIN FORM */}
            <Col xs={24} lg={12} className="p-10 flex items-center">
              <div className="w-full max-w-md mx-auto">
                <Title level={2} className="text-gray-800 mb-2">
                  Welcome Back
                </Title>
                <Text type="secondary" className="block mb-8">
                  Please sign in to your account
                </Text>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{
                    email: "",
                    password: "",
                    remember: true,
                  }}
                >
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
                      {
                        required: true,
                        message: "Please enter your password!",
                      },
                    ]}
                  >
                    <Input.Password
                      placeholder="Enter your password"
                      iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                      }
                    />
                  </Form.Item>

                  <Form.Item name="remember" valuePropName="checked">
                    <Checkbox>Remember me</Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      block
                      size="large"
                      className="font-semibold"
                    >
                      Login
                    </Button>
                  </Form.Item>

                  <Divider plain>or login with</Divider>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Button
                        block
                        icon={<GoogleOutlined />}
                        className="border-gray-300"
                      >
                        Google
                      </Button>
                    </Col>
                    <Col span={12}>
                      <Button
                        block
                        icon={<FacebookFilled />}
                        style={{ backgroundColor: "#1877F2", color: "white" }}
                      >
                        Facebook
                      </Button>
                    </Col>
                  </Row>

                  <div className="text-center mt-6">
                    <Text type="secondary">
                      Don’t have an account?{" "}
                      <Link
                        to="/auth/register"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Sign Up
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

            {/* RIGHT: LOGO (with CSS animation) */}
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
>>>>>>> Stashed changes
      </div>
    </div>
  );
};

export default LoginPage;

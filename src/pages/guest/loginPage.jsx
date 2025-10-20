import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Typography, Divider, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone, GoogleOutlined, FacebookFilled } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import logoGarage from "../../assets/logo.png";
import bgImage from "../../assets/3408105.jpg";
import { toast } from "react-toastify";
import api from "../../config/axios";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try{
        const response = await api.post("/User/register", values);
      toast.success("Login successful!");
      navigate("/admin");
      console.log(response);
    }
    catch (e){
        console.error(e);
        message.error("Login failed. Please try again.");
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
                    rules={[{ required: true, message: "Please enter your password!" }]}
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
                      loading={isLoading}
                    >
                      Login
                    </Button>
                  </Form.Item>

                  <Divider plain>or login with</Divider>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Button block icon={<GoogleOutlined />} className="border-gray-300">
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
      </div>
    </>
  );
};

export default LoginPage;

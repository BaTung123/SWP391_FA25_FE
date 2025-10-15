import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Checkbox,
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
import api from "../../config/axios"; // ✅ dùng config chung
import logoGarage from "../../assets/logo.png";
import bgImage from "../../assets/3408105.jpg";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });

      message.success("Registration successful!");
      navigate("/auth/login");
    } catch (error) {
      console.error("Register error:", error);
      message.error(
        error.response?.data?.message ||
          "Registration failed, please try again!"
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
          {/* LEFT SIDE: REGISTER FORM */}
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
                  email: "",
                  password: "",
                  confirmPassword: "",
                  agreeTerms: false,
                }}
              >
                <Form.Item
                  label="Full Name"
                  name="fullName"
                  rules={[
                    { required: true, message: "Please enter your full name!" },
                  ]}
                >
                  <Input placeholder="Enter your full name" />
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
                    {
                      min: 6,
                      message: "Password must be at least 6 characters",
                    },
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
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Passwords do not match!")
                        );
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
                  name="agreeTerms"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value
                          ? Promise.resolve()
                          : Promise.reject(
                              new Error("You must agree to the terms!")
                            ),
                    },
                  ]}
                >
                  <Checkbox>
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-700">
                      Terms and Conditions
                    </a>
                  </Checkbox>
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
                    Create Account
                  </Button>
                </Form.Item>

                <Divider plain>or register with</Divider>

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
                    Already have an account?{" "}
                    <Link
                      to="/auth/login"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign In
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
      </div>
    </div>
  );
};

export default RegisterPage;

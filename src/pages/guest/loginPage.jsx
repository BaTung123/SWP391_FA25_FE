import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Row,
  Col,
  Typography,
  message,
} from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import logoGarage from "../../assets/logo.png";
import bgImage from "../../assets/3408105.jpg";
import api from "../../config/axios";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { userName, password, remember } = values || {};
    if (!userName || !password) {
      message.warning("Vui lòng nhập Tên đăng nhập và Mật khẩu.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/User/login", {
        userName: userName.trim(),
        password: password,
      });

      const data = res?.data || {};
      const token = data.token;
      const role =
        typeof data.isRole === "number" ? data.isRole : Number(data.isRole);

      if (!token) {
        throw new Error("Không nhận được token từ máy chủ.");
      }

     const store = remember ? localStorage : sessionStorage;

    // Lưu token + set header cho axios
    store.setItem("token", token);
    localStorage.setItem("token", token); // nhiều chỗ đang đọc từ localStorage
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // 4) Lưu localStorage user (để các trang khác dùng)
     const userObj = {
      ...(data.user || {}),                           // nếu BE trả kèm user
      userName: (data.user?.userName ?? userName).trim(),
      role,                                           // 0 = member, 1 = admin
      token,
    };
      localStorage.setItem("user", JSON.stringify(userObj));

      // 5) Ghi nhớ đăng nhập (nếu bạn muốn lưu userName)
      if (remember) {
        localStorage.setItem("remember_userName", userName.trim());
      } else {
        localStorage.removeItem("remember_userName");
      }

      if (role === 1) {
        message.success("Đăng nhập Admin thành công!");
        navigate("/admin", { replace: true });
      } else if (role === 0) {
        message.success("Đăng nhập Member thành công!");
        navigate("/member", { replace: true });
      } else {
        message.success("Đăng nhập thành công!");
        navigate("/", { replace: true });
      }
    } catch (e) {
      console.error("Login error:", e?.response?.data || e?.message);
      // Xoá token/user cũ nếu có
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common.Authorization;

      const apiMsg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      message.error(apiMsg);
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
        .logo-anim { animation: fadeZoom 1.2s ease-out both; }
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
                  ĐĂNG NHẬP TÀI KHOẢN
                </Title>
                <Text type="secondary" className="block mb-8">
                  Hãy điền thông tin của bạn để đăng nhập
                </Text>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{
                    userName: localStorage.getItem("remember_userName") || "",
                    password: "",
                    remember: !!localStorage.getItem("remember_userName"),
                  }}
                >
                  <Form.Item
                    label="Tên Đăng Nhập"
                    name="userName"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your user name!",
                      },
                    ]}
                  >
                    <Input placeholder="Enter your user name" />
                  </Form.Item>

                  <Form.Item
                    label="Mật Khẩu"
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
                    <Checkbox>Lưu Mật Khẩu</Checkbox>
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
                      Đăng Nhập
                    </Button>
                  </Form.Item>

                  <div className="text-center mt-6">
                    <Text type="secondary">
                      Bạn Chưa Có Tài Khoản?{" "}
                      <Link
                        to="/auth/register"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Đăng Ký
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

export default LoginPage;

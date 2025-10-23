import React, { useState } from "react";
import {
  Form, Input, Button, Checkbox, Row, Col, Typography, message
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
    setIsLoading(true);
    try {
      // 1) Lấy dữ liệu user từ /User theo cấu hình của bạn
      const res = await api.get("/User");
      console.log("[/User] response =", res?.data);

      let user = null;
      if (Array.isArray(res?.data)) {
        // Trường hợp BE trả LIST users (ví dụ như bạn demo)
        const key = (values.userName || "").trim().toLowerCase();
        user =
          res.data.find(
            (u) =>
              u?.userName?.toLowerCase() === key ||
              u?.email?.toLowerCase() === key
          ) || null;
      } else if (res?.data) {
        // Trường hợp BE trả CURRENT user (đã xác thực)
        user = res.data;
      }

      console.log("[login] picked user =", user);

      if (!user) {
        message.error("Không tìm thấy người dùng phù hợp. Kiểm tra User Name/email.");
        return;
      }

      // 2) Lưu localStorage (để ProtectedRoute/ứng dụng dùng)
      localStorage.setItem("user", JSON.stringify(user));

      // Nếu router của bạn đang check token, set 1 giá trị để pass ProtectedRoute.
      // Nếu bạn KHÔNG dùng token → có thể xóa dòng này.
      if (!localStorage.getItem("token")) {
        localStorage.setItem("token", "ok");
      }

      // 3) Điều hướng theo role (đảm bảo role là number)
      const roleNum = typeof user.role === "number" ? user.role : Number(user.role);
      console.log("[login] roleNum =", roleNum, "type=", typeof roleNum);

      if (roleNum === 1) {
        navigate("/admin", { replace: true });
      } else if (roleNum === 0) {
        navigate("/member", { replace: true });
      } else {
        message.warning("Không xác định được vai trò người dùng để điều hướng.");
      }
    } catch (e) {
      console.error("Login error:", e?.response?.data || e?.message);
      message.error("Đăng nhập thất bại. Vui lòng thử lại sau.");
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
                <Title level={2} className="text-gray-800 mb-2">Welcome Back</Title>
                <Text type="secondary" className="block mb-8">
                  Please sign in to your account
                </Text>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  initialValues={{ userName: "", password: "", remember: true }}
                >
                  <Form.Item
                    label="User Name hoặc Email"
                    name="userName"
                    rules={[{ required: true, message: "Please enter your user name!" }]}
                  >
                    <Input placeholder="Enter your user name or email" />
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

                  <div className="text-center mt-6">
                    <Text type="secondary">
                      Don’t have an account?{" "}
                      <Link to="/auth/register" className="text-blue-600 hover:text-blue-700 font-medium">
                        Sign Up
                      </Link>
                    </Text>
                  </div>

                  <div className="mt-4 text-center">
                    <Link to="/" className="text-blue-700 font-semibold hover:underline">
                      Quay lại Trang chủ
                    </Link>
                  </div>
                </Form>
              </div>
            </Col>

            {/* RIGHT: LOGO */}
            <Col xs={24} lg={12} className="relative flex items-center justify-center overflow-hidden bg-white">
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


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

/* ================= Helpers ================= */
const extractUserId = (obj) => {
  if (!obj || typeof obj !== "object") return null;
  return (
    obj.userId ??
    obj.UserId ??
    obj.userID ??
    obj.id ??
    obj.Id ??
    obj.ID ??
    obj.user_id ??
    obj.uid ??
    obj.sub ??
    obj.nameid ??
    null
  );
};

const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};
/* ========================================== */

const LoginPage = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ message API để hiện toast
  const [msgApi, contextHolder] = message.useMessage();

  // ✅ helper: hiển thị toast rồi mới điều hướng
  const showAndGo = async (content, path) => {
    await msgApi.open({ type: "success", content, duration: 1 });
    navigate(path, { replace: true });
  };

  const handleSubmit = async (values) => {
    const { userName, password, remember } = values || {};
    if (!userName || !password) {
      msgApi.warning("Vui lòng nhập Tên đăng nhập và Mật khẩu.");
      return;
    }

    setIsLoading(true);
    try {
      // 1️⃣ Gọi API login
      const trimmedUserName = userName.trim();
      const loginPayload = {
        userName: trimmedUserName,
        password: password, // Không trim password
      };

      const res = await api.post("/User/login", loginPayload, {
        headers: { "Content-Type": "application/json" },
      });

      const data = res?.data || {};
      const token = data.token;
      if (!token) throw new Error("Không nhận được token từ máy chủ.");

      // 2️⃣ Lưu token + header
      const store = remember ? localStorage : sessionStorage;
      store.setItem("token", token);
      localStorage.setItem("token", token); // để các trang khác đọc được
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // Parse JWT để lấy thông tin user
      const jwtClaims = parseJwt(token) || {};

      // 3️⃣ Lấy thông tin user (thông qua API /User) để xác định role
      let matchedUser = null;
      let role = null;

      try {
        const userRes = await api.get("/User");
        const users = Array.isArray(userRes.data)
          ? userRes.data
          : userRes.data?.data || [];

        matchedUser =
          users.find(
            (u) =>
              String(u.userName || u.email).toLowerCase() ===
              String(userName).toLowerCase()
          ) || users[0];

        if (matchedUser?.role !== undefined && matchedUser?.role !== null) {
          role =
            typeof matchedUser.role === "number"
              ? matchedUser.role
              : Number(matchedUser.role);
        }
      } catch {
        // có thể BE không hỗ trợ /User — bỏ qua
      }

      // fallback: role từ login response hoặc JWT
      if (role === null || role === undefined || isNaN(role)) {
        if (data.isRole !== undefined && data.isRole !== null) {
          role =
            typeof data.isRole === "number" ? data.isRole : Number(data.isRole);
        } else if (data.role !== undefined && data.role !== null) {
          role = typeof data.role === "number" ? data.role : Number(data.role);
        }
      }
      if ((role === null || role === undefined || isNaN(role)) && jwtClaims) {
        if (jwtClaims.role !== undefined && jwtClaims.role !== null) {
          role =
            typeof jwtClaims.role === "number"
              ? jwtClaims.role
              : Number(jwtClaims.role);
        } else if (jwtClaims.isRole !== undefined && jwtClaims.isRole !== null) {
          role =
            typeof jwtClaims.isRole === "number"
              ? jwtClaims.isRole
              : Number(jwtClaims.isRole);
        }
      }
      if (role === null || role === undefined || isNaN(role)) {
        role = 0; // mặc định Member
      }

      const userId =
        extractUserId(matchedUser) ||
        extractUserId(jwtClaims) ||
        extractUserId(data) ||
        null;

      // 4️⃣ Lưu user vào localStorage
      const userObj = {
        ...(matchedUser || {}),
        userName: (matchedUser?.userName ?? userName).trim(),
        role: Number(role),
        token,
        userId,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      if (userId != null) localStorage.setItem("userId", String(userId));

      // 5️⃣ Nhớ username nếu cần
      if (remember) {
        localStorage.setItem("remember_userName", userName.trim());
        msgApi.success("Đã lưu tên đăng nhập cho lần sau.");
      } else {
        localStorage.removeItem("remember_userName");
      }

      // 6️⃣ THÔNG BÁO THÀNH CÔNG + ĐIỀU HƯỚNG (đợi toast xong rồi navigate)
      const welcome = `Chào mừng, ${userObj.userName}!`;
      if (role === 1) {
        await showAndGo(`${welcome} Bạn đang đăng nhập với vai trò Admin.`, "/admin");
      } else if (role === 2) {
        await showAndGo(
          `${welcome} Bạn đang đăng nhập với vai trò Staff.`,
          "/staff/group-management"
        );
      } else if (role === 0) {
        await showAndGo(`${welcome} Bạn đang đăng nhập với vai trò Member.`, "/member");
      } else {
        await showAndGo(`${welcome} Đăng nhập thành công!`, "/");
      }
    } catch (e) {
      // cleanup
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      delete api.defaults.headers.common.Authorization;

      let apiMsg = "Đăng nhập thất bại. Vui lòng thử lại.";
      if (e?.response?.status === 401) {
        const backendMsg = e?.response?.data?.message || e?.response?.data?.error;
        apiMsg =
          backendMsg || "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.";
      } else if (e?.response?.data?.message) {
        apiMsg = e.response.data.message;
      } else if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.message) {
        apiMsg = e.message;
      }
      message.error(apiMsg); // dùng message global để chắc chắn hiển thị
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* holder cho message.useMessage() */}
      {contextHolder}

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
                    rules={[{ required: true, message: "Please enter your user name!" }]}
                  >
                    <Input placeholder="Enter your user name" />
                  </Form.Item>

                  <Form.Item
                    label="Mật Khẩu"
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

                  <Form.Item
                    name="remember"
                    valuePropName="checked"
                    className="flex justify-start mb-4"
                    style={{ marginBottom: "12px" }}
                  >
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
                    <Link to="/" className="text-blue-700 font-semibold hover:underline">
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
                  backgroundImage: `url(${logoGarage})}`,
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

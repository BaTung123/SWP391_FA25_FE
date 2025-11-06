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

  const handleSubmit = async (values) => {
    const { userName, password, remember } = values || {};
    if (!userName || !password) {
      message.warning("Vui lòng nhập Tên đăng nhập và Mật khẩu.");
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

      console.log("🔐 Attempting login with:", {
        userName: trimmedUserName,
        passwordLength: password?.length || 0,
        payload: { ...loginPayload, password: "***" } // Ẩn password trong log
      });

      const res = await api.post("/User/login", loginPayload, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = res?.data || {};
      const token = data.token;

      console.log("✅ Login response received:", {
        hasToken: !!token,
        dataKeys: Object.keys(data),
        role: data.role || data.isRole,
        fullData: data
      });

      if (!token) throw new Error("Không nhận được token từ máy chủ.");

      // 2️⃣ Lưu token + header
      const store = remember ? localStorage : sessionStorage;
      store.setItem("token", token);
      localStorage.setItem("token", token); // để các trang khác đọc được
      api.defaults.headers.common.Authorization = `Bearer ${token}`;

      // Parse JWT để lấy thông tin user
      const jwtClaims = parseJwt(token) || {};
      
      // 3️⃣ Lấy thông tin user (thông qua API /User)
      let matchedUser = null;
      let role = null;
      
      try {
        const userRes = await api.get("/User");
        // Nếu backend trả danh sách -> lấy user đầu tiên khớp userName
        const users = Array.isArray(userRes.data)
          ? userRes.data
          : userRes.data?.data || [];

        matchedUser =
          users.find(
            (u) =>
              String(u.userName || u.email).toLowerCase() ===
              String(userName).toLowerCase()
          ) || users[0];

        // Ưu tiên lấy role từ matchedUser
        if (matchedUser?.role !== undefined && matchedUser?.role !== null) {
          role = typeof matchedUser.role === "number" ? matchedUser.role : Number(matchedUser.role);
        }
      } catch (userError) {
        console.warn("⚠️ Không thể lấy thông tin user từ API /User:", userError);
      }

      // Nếu chưa có role, thử lấy từ login response (isRole hoặc role)
      if (role === null || role === undefined || isNaN(role)) {
        if (data.isRole !== undefined && data.isRole !== null) {
          role = typeof data.isRole === "number" ? data.isRole : Number(data.isRole);
        } else if (data.role !== undefined && data.role !== null) {
          role = typeof data.role === "number" ? data.role : Number(data.role);
        }
      }

      // Nếu vẫn chưa có role, thử lấy từ JWT claims
      if ((role === null || role === undefined || isNaN(role)) && jwtClaims) {
        if (jwtClaims.role !== undefined && jwtClaims.role !== null) {
          role = typeof jwtClaims.role === "number" ? jwtClaims.role : Number(jwtClaims.role);
        } else if (jwtClaims.isRole !== undefined && jwtClaims.isRole !== null) {
          role = typeof jwtClaims.isRole === "number" ? jwtClaims.isRole : Number(jwtClaims.isRole);
        }
      }

      // Mặc định role = 0 (Member) nếu không xác định được
      if (role === null || role === undefined || isNaN(role)) {
        console.warn("⚠️ Không xác định được role, mặc định là Member (0)");
        role = 0;
      }

      const userId =
        extractUserId(matchedUser) || extractUserId(jwtClaims) || extractUserId(data) || null;

      if (!userId) {
        console.warn("⚠️ Không xác định được userId. Hãy kiểm tra API /User trả về gì.");
      }

      // 4️⃣ Lưu user vào localStorage
      const userObj = {
        ...(matchedUser || {}),
        userName: (matchedUser?.userName ?? userName).trim(),
        role: Number(role), // Đảm bảo role luôn là number
        token,
        userId,
      };

      console.log("✅ Login successful - Role:", role, "User:", userObj);

      localStorage.setItem("user", JSON.stringify(userObj));
      if (userId != null) localStorage.setItem("userId", String(userId));

      // 5️⃣ Nhớ username nếu cần
      if (remember) {
        localStorage.setItem("remember_userName", userName.trim());
      } else {
        localStorage.removeItem("remember_userName");
      }

      // 6️⃣ Điều hướng sau đăng nhập
      if (role === 1) {
        message.success("Đăng nhập Admin thành công!");
        navigate("/admin", { replace: true });
      } else if (role === 2) {
        message.success("Đăng nhập Staff thành công!");
        navigate("/staff/group-management", { replace: true });
      } else if (role === 0) {
        message.success("Đăng nhập Member thành công!");
        navigate("/member", { replace: true });
      } else {
        message.success("Đăng nhập thành công!");
        navigate("/", { replace: true });
      }
    } catch (e) {
      console.error("Login error:", e?.response?.data || e?.message);
      console.error("Error details:", {
        status: e?.response?.status,
        statusText: e?.response?.statusText,
        data: e?.response?.data,
        message: e?.message,
        requestUrl: e?.config?.url,
        requestMethod: e?.config?.method,
        requestData: e?.config?.data ? JSON.parse(e.config.data) : null
      });
      
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
      delete api.defaults.headers.common.Authorization;

      let apiMsg = "Đăng nhập thất bại. Vui lòng thử lại.";
      
      if (e?.response?.status === 401) {
        // Hiển thị message từ backend nếu có, nếu không thì dùng message mặc định
        const backendMsg = e?.response?.data?.message || e?.response?.data?.error;
        apiMsg = backendMsg || "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.";
      } else if (e?.response?.data?.message) {
        apiMsg = e.response.data.message;
      } else if (e?.response?.data?.error) {
        apiMsg = e.response.data.error;
      } else if (e?.message) {
        apiMsg = e.message;
      }
      
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

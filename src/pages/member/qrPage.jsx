import React, { useEffect, useMemo, useState } from "react";
import { FaQrcode } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { message } from "antd";
import api from "../../config/axios";
import Header from "../../components/header/header";

/** Helpers: đọc token & userId đã lưu sau Login */
function safeParseJSON(s) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function getStoredAuth() {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token") || null;

  const userStr = localStorage.getItem("user");
  const user = userStr ? safeParseJSON(userStr) : null;

  const userIdStr = localStorage.getItem("userId");
  const fallbackId = user && (user.userId ?? user.id ?? user.ID);
  const userId =
    userIdStr != null
      ? Number(userIdStr)
      : fallbackId != null
      ? Number(fallbackId)
      : null;

  return { token, user, userId };
}

const QRPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // số tiền truyền từ DepositPage
  const amount = useMemo(
    () => Number(location?.state?.amount ?? 0),
    [location?.state?.amount]
  );

  const [showQR, setShowQR] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // lấy auth từ local
  const [authState, setAuthState] = useState(() => getStoredAuth());
  const { token, userId } = authState;

  // set header Authorization nếu có token
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  // validate amount để hiển thị QR
  useEffect(() => {
    setShowQR(amount >= 10000 && amount <= 10000000);
  }, [amount]);

  // phải có userId, nếu không chuyển về login
  useEffect(() => {
    if (userId == null || Number.isNaN(Number(userId))) {
      message.error("Không tìm thấy tài khoản hiện tại. Vui lòng đăng nhập lại.");
      navigate("/auth/login", { replace: true });
    }
  }, [userId, navigate]);

  const handleTopUp = () => {
    if (amount >= 10000 && amount <= 10000000) {
      setShowQR(true);
    } else {
      alert("Số tiền phải nằm trong khoảng từ 10.000 đến 10.000.000 VND.");
    }
  };

  const handleChange = (e) => {
    const value = Number(e.target.value || 0);
    if (value < 0 || value > 10000000) return;
    // cập nhật lại state điều hướng để giữ amount khi refresh (không bắt buộc)
    navigate(".", { state: { amount: value }, replace: true });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
      Number(price || 0)
    );

  // API helpers
  const fetchUser = async (id) => {
    const res = await api.get(`/User/${id}`);
    return res?.data;
  };

  const updateUser = async (id, payload) => {
    await api.put(`/User/${id}`, payload);
  };

  const handleConfirmPaid = async () => {
    if (userId == null) {
      message.error("Không tìm thấy tài khoản hiện tại.");
      return;
    }
    if (!amount || amount < 10000 || amount > 10000000) {
      message.warning("Số tiền nạp không hợp lệ.");
      return;
    }

    setSubmitting(true);
    try {
      // 1) Lấy user hiện tại
      const user = await fetchUser(Number(userId));

      // 2) Tính số dư mới
      const currentBalance = Number(user?.balance ?? 0);
      const nextBalance = currentBalance + Number(amount);

      // 3) PUT cập nhật balance (giữ nguyên các field khác)
      await updateUser(Number(userId), { ...user, balance: nextBalance });

      // (tuỳ chọn) cập nhật lại localStorage.user nếu muốn đồng bộ ngay trên UI
      try {
        const uStr = localStorage.getItem("user");
        const u = uStr ? safeParseJSON(uStr) : {};
        localStorage.setItem(
          "user",
          JSON.stringify({ ...(u || {}), balance: nextBalance })
        );
      } catch {}

      message.success(
        `Nạp ${formatPrice(amount)} thành công! Số dư mới: ${formatPrice(nextBalance)}`
      );

      navigate("/member/wallet", { replace: true });
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Cập nhật số dư thất bại. Vui lòng thử lại.";
      message.error(msg);

      // nếu lỗi 401 → token hết hạn → yêu cầu login lại
      if (e?.response?.status === 401) {
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        delete api.defaults.headers.common.Authorization;
        setAuthState({ token: null, user: null, userId: null });
        navigate("/auth/login", { replace: true });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="w-full flex justify-center items-center flex-1">
        <div className="rounded-lg bg-white p-8 shadow-lg w-full max-w-md text-center">
          <h1 className="text-4xl font-bold text-indigo-900 mb-8">Ví điện tử</h1>

          {!showQR ? (
            <>
              <label className="block text-left text-lg font-medium text-gray-700 mb-2">
                Số tiền cần nạp:
              </label>
              <input
                type="number"
                value={Number.isFinite(amount) ? amount : ""}
                onChange={handleChange}
                placeholder="Từ 10.000 đến 10.000.000"
                className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg text-lg focus:border-indigo-500 focus:outline-none mb-4"
                min={10000}
                max={10000000}
              />

              <button
                onClick={handleTopUp}
                disabled={!amount || amount < 10000 || amount > 10000000}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Nạp tiền
              </button>
            </>
          ) : (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Quét mã QR để thanh toán
              </h2>

              {/* QR giả lập */}
              <div className="bg-gray-100 p-8 rounded-lg inline-block mb-4">
                <FaQrcode className="text-gray-500 w-32 h-32 mx-auto" />
              </div>

              <p className="text-lg font-medium mb-2">
                Số tiền: {formatPrice(amount)}
              </p>
              <p className="text-gray-600 mb-6">
                Dùng ứng dụng ngân hàng hoặc ví điện tử để quét mã này.
              </p>

              <button
                onClick={handleConfirmPaid}
                disabled={submitting}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Đang xác nhận..." : "Xác nhận đã thanh toán"}
              </button>

              <button
                onClick={() => navigate("/member/wallet")}
                className="w-full mt-3 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRPage;
